package com.example.chat_project;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
// @Table(name = "USER")
public class Customer {

  @Id
  @GeneratedValue(strategy=GenerationType.AUTO)
  private Long id;
  private String name;
  private String hashpass;

  protected Customer() {}

  public Customer(String name, String hashpass) {
    this.name = name;
    this.hashpass = hashpass;
  }

  @Override
  public String toString() {
    return String.format(
        "Customer[id=%d, name='%s']",
        id, name);
  }

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

}