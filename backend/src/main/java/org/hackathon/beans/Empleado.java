package org.hackathon.beans;

import org.springframework.hateoas.ResourceSupport;

import java.io.Serializable;

public class Empleado extends ResourceSupport implements Serializable {

    private String nombre;
    private String apellido;
    private long empleadoID;

    public Empleado(String nombre, String apellido, long empleadoID) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.empleadoID = empleadoID;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public long getEmpleadoID() {
        return empleadoID;
    }
}