package com.SkillSwap.PeerToPeerLearning.Auth.Controller;

import com.SkillSwap.PeerToPeerLearning.Auth.Dto.ProfileRequest;
import com.SkillSwap.PeerToPeerLearning.Auth.Dto.ProfileResponse;
import com.SkillSwap.PeerToPeerLearning.Auth.Service.ProfileService;
import com.SkillSwap.PeerToPeerLearning.Auth.Service.impl.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;
    private final EmailService emailService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ProfileResponse register(@Valid @RequestBody ProfileRequest request) {
        ProfileResponse response = profileService.createProfile(request);
        emailService.sendWelcomeEmail(response.getEmail(), response.getName());
        return response;
    }

    @GetMapping("/profile")
    public ProfileResponse getProfile(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        return profileService.getProfile(email);
    }
}
