package com.example.chat_project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ResponseBody;

// import org.springframework.context.annotation.Bean;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.boot.CommandLineRunner;

@SpringBootApplication
@RestController
public class ChatProjectApplication {

    // private static final Logger log = LoggerFactory.getLogger(ChatProjectApplication.class);
    @Autowired
    private UserRepository userRepository;
	public static void main(String[] args) {
		SpringApplication.run(ChatProjectApplication.class, args);
	}
    @GetMapping("/hello")
    public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
        if(userRepository != null){
            userRepository.save(new Customer(name,"hashpass"));
        }
        return String.format("Hello %s!", name);
    }

    @GetMapping("/all")
    public @ResponseBody Iterable<Customer> getAllUsers() {
        return userRepository.findAll();
    }
    

    // @GetMapping("/hello/{name}")
    // public String hello(@PathVariable String name) {
    //     return String.format("Hello %s!", name);
    // }

    // @Bean
    // public CommandLineRunner demo(UserRepository repository) {
    //     return (args) -> {
    //     // save a few customers
    //     repository.save(new Customer("Nam","hashpass"));
    //     repository.save(new Customer("Phong","hashpass"));

    //     // fetch all customers
    //     log.info("Customers found with findAll():");
    //     log.info("-------------------------------");
    //     for (Customer customer : repository.findAll()) {
    //         log.info(customer.toString());
    //     }
    //     log.info("");

    //     // fetch an individual customer by ID
    //     Customer customer = repository.findById(1L);
    //     log.info("Customer found with findById(1L):");
    //     log.info("--------------------------------");
    //     log.info(customer.toString());
    //     log.info("");

    //     // fetch customers by last name
    //     log.info("Customer found with findByLastName('Nam'):");
    //     log.info("--------------------------------------------");
    //     repository.findByLastName("Nam").forEach(user -> {
    //         log.info(user.toString());
    //     });
    //     log.info("");
    //     };
    // }


    
}

