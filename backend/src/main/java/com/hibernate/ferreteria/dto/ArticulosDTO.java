package com.hibernate.ferreteria.dto;

public class ArticulosDTO {
    private Long id;
    private String nombreArticulo;
    private Double precio;
    private Integer existencia;

    public ArticulosDTO(String nombreArticulo, Long id, Double precio, Integer existencia) {
        this.id = id;
        this.nombreArticulo = nombreArticulo;
        this.precio = precio;
        this.existencia = existencia;
    }

    public ArticulosDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreArticulo() {
        return nombreArticulo;
    }

    public void setNombreArticulo(String nombreArticulo) {
        this.nombreArticulo = nombreArticulo;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Integer getExistencia() {
        return existencia;
    }

    public void setExistencia(Integer existencia) {
        this.existencia = existencia;
    }

    @Override
    public String toString() {
        return "ArticulosDTO{" +
                "id=" + id +
                ", nombreArticulo='" + nombreArticulo + '\'' +
                ", precio=" + precio +
                ", existencia=" + existencia +
                '}';
    }
}
