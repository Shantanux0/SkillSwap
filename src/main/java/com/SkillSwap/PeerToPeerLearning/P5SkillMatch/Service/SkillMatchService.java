package com.SkillSwap.PeerToPeerLearning.P5SkillMatch.Service;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Repository.UserAuthRepo;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Repository.UserProfileRepository;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.entity.UserProfileEntity;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.AResumeService.ResumeService;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Certification.DTO.CertificationDto;
import com.SkillSwap.PeerToPeerLearning.P4testPortal.Service.IMPL.TestPortalService;
import com.SkillSwap.PeerToPeerLearning.P5SkillMatch.Dto.MatchResponseDto;
import com.SkillSwap.PeerToPeerLearning.P6Feedback.Service.ReputationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillMatchService {

    private final UserProfileRepository userProfileRepository;
    private final UserAuthRepo userAuthRepo;
    private final TestPortalService testPortalService;
    private final ResumeService resumeService;
    private final ReputationService reputationService;

    // Weights
    private static final double TEST_WEIGHT = 0.4;
    private static final double CERT_WEIGHT = 0.3;
    private static final double FEEDBACK_WEIGHT = 0.3;

    /**
     * Recommends teachers for a given skill.
     */
    public List<MatchResponseDto> recommendTeachers(String learnerEmail, String skillToLearn) {
        UserAuthEntity learner = userAuthRepo.findByEmail(learnerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (skillToLearn == null || skillToLearn.isBlank()) {
            return Collections.emptyList();
        }

        // 1. Find potential teachers (users who have this skill in their profile)
        // Note: Ideally efficient SQL query, here simplified filtering in memory or
        // minimal Repo support
        // Assuming userProfileRepository.findAll() is manageable or we add
        // findBySkillsContaining
        List<UserProfileEntity> allProfiles = userProfileRepository.findAll();

        List<UserProfileEntity> candidates = allProfiles.stream()
                .filter(p -> !p.getUser().getId().equals(learner.getId())) // Not self
                .filter(p -> p.getSkills() != null &&
                        p.getSkills().toLowerCase().contains(skillToLearn.toLowerCase()))
                .collect(Collectors.toList());

        List<MatchResponseDto> matches = new ArrayList<>();

        for (UserProfileEntity candidate : candidates) {
            Long candidateId = candidate.getUser().getId();
            String candidateEmail = candidate.getUser().getEmail();

            // 2. Access Scores
            Double testScore = testPortalService.getBestTestScore(candidateId, skillToLearn);
            Double reputationScore = reputationService.getUserReputation(candidateId);

            // Cert Score: get max cred score for this skill
            List<CertificationDto> certs = resumeService.getAllCertifications(candidateEmail);
            Double certScore = certs.stream()
                    .filter(c -> c.getSkillName().equalsIgnoreCase(skillToLearn)
                            || c.getCertificationName().toLowerCase().contains(skillToLearn.toLowerCase()))
                    .mapToDouble(c -> c.getCredibilityScore() != null ? c.getCredibilityScore() : 0.0)
                    .max()
                    .orElse(0.0);

            // Normalize Reputation (1-5 -> 0-1)
            Double normalizedRep = Math.min(reputationScore / 5.0, 1.0);

            // 3. Calculate Final Weighted Score
            Double finalScore = (testScore * TEST_WEIGHT) + (certScore * CERT_WEIGHT)
                    + (normalizedRep * FEEDBACK_WEIGHT);

            matches.add(MatchResponseDto.builder()
                    .userId(candidateId)
                    .name(candidate.getFirstName() + " " + candidate.getLastName())
                    .email(candidateEmail)
                    .profileImageUrl(candidate.getProfileImageUrl())
                    .skillName(skillToLearn)
                    .matchScore(finalScore)
                    .testScore(testScore)
                    .certificationScore(certScore)
                    .reputationScore(reputationScore) // Return raw rep for display
                    .role("TEACHER")
                    .build());
        }

        // 4. Sort by Match Score Descending
        matches.sort(Comparator.comparingDouble(MatchResponseDto::getMatchScore).reversed());

        return matches;
    }
}
