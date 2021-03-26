package com.example.chat_project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

@SpringBootApplication
@RestController
public class ChatProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatProjectApplication.class, args);
	}
    @GetMapping("/hello")
    public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
        return String.format("Hello %s!", name);
    }
    // @GetMapping("/hello/{name}")
    // public String hello(@PathVariable String name) {
    //     return String.format("Hello %s!", name);
    // }

}

