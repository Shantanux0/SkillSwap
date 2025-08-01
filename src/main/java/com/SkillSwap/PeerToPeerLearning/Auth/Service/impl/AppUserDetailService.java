package com.SkillSwap.PeerToPeerLearning.Auth.Service.impl;

import com.SkillSwap.PeerToPeerLearning.Auth.Entity.UserAuthEntity;
import com.SkillSwap.PeerToPeerLearning.Auth.Repository.UserAuthRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AppUserDetailService  implements UserDetailsService {

    private final UserAuthRepo authRepo;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserAuthEntity existingUser = authRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found for the email: " + email));
        return new User(existingUser.getEmail(), existingUser.getPassword(), new ArrayList<>());
    }

}
