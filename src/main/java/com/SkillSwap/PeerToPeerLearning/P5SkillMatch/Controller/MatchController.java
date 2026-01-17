package com.SkillSwap.PeerToPeerLearning.P5SkillMatch.Controller;

import com.SkillSwap.PeerToPeerLearning.P5SkillMatch.Dto.MatchResponseDto;
import com.SkillSwap.PeerToPeerLearning.P5SkillMatch.Service.SkillMatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor

public class MatchController {

    private final SkillMatchService skillMatchService;

    @GetMapping("/recommend")
    public ResponseEntity<List<MatchResponseDto>> getRecommendations(
            @RequestParam String skill,
            Authentication authentication) {

        String email = authentication.getName();
        List<MatchResponseDto> matches = skillMatchService.recommendTeachers(email, skill);
        return ResponseEntity.ok(matches);
    }
}
