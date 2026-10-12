package com.hibernate.ferreteria;

import com.hibernate.ferreteria.entity.Articulos;
import com.hibernate.ferreteria.repositorios.Repo_articulos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.List;

@SpringBootApplication
public class FerreteriaApplication implements CommandLineRunner {

	@Autowired
	private Repo_articulos repositorio;

	public static void main(String[] args) {
		SpringApplication.run(FerreteriaApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		System.out.println("aplicacion iniciada correctamente");
		List<Articulos> articulos = repositorio.findAll();
		articulos.stream().forEach(System.out::println);
	}
}
