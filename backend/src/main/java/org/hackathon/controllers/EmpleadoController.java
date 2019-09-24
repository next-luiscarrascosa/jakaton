package org.hackathon.controllers;

import org.hackathon.beans.Empleado;
import org.springframework.hateoas.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.atomic.AtomicLong;

@RestController
public class EmpleadoController {

    @GetMapping("/employees/{id}")
    Resource<Empleado> one(@PathVariable Long id) {

        Empleado employee = repository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(id));

        return new Resource<>(employee,
                linkTo(methodOn(EmployeeController.class).one(id)).withSelfRel(),
                linkTo(methodOn(EmployeeController.class).all()).withRel("employees"));
    }
}
