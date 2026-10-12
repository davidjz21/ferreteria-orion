package com.hibernate.ferreteria.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="articulos")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Articulos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nombreArticulo")
    private String nombreArticulo;

    @Column(name = "precio")
    private Double precio;

    @Column(name = "existencia")
    private Integer existencia;


    /* metodo por consola
    @Override
    public String toString() {
        return "Articulo{"+
               "id = " + id +
                       ", Nombrearticulo: '" + nombreArticulo + '\''+
                       ", precio: " + precio +
                       ", existencia: "+ existencia +
                       '}';

    }
     */
}
