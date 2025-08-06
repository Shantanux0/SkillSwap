package com.SkillSwap.PeerToPeerLearning.P2UserProfile.Dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UserProfileResponseDto {
    private Long id;
    private String email; // From UserAuthEntity
    private String firstName;
    private String lastName;
    private String bio;
    private String profileImageUrl;
    private LocalDate dateOfBirth;
    private String phoneNumber;
    private String location;
    private String website;
    private String linkedinUrl;
    private String githubUrl;
    private String skills;
    private String interests;
    private boolean isVerified; // From UserAuthEntity
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
