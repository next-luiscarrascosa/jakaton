package org.hackathon.controllers;

import org.hackathon.beans.Empleado;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class EmpleadoController {



    @GetMapping("/empleados")
    public List<Empleado> getEmpleados() {
        Link link = ControllerLinkBuilder
                .linkTo(EmpleadoController.class)
                .slash(Empleado.getEmployeeId())
                .withSelfRel();

        return jdbcTemplate.query(
                "SELECT * FROM empleados",
                (rs, rowNum) ->
                        new Empleado(
                                rs.getString("nombre"),
                                rs.getString("apellido"),
                                rs.getLong("empleadoID")
                        )
        );
    }

    @GetMapping("/employees/{id}")
    Resource<Empleado> one(@PathVariable Long id) {

    }

/*    @GetMapping("/getEmpleados")
    public List<String> getTuples() {
        return this.jdbcTemplate.queryForList("SELECT * FROM empleados").stream()
                .map((m) -> m.values().toString())
                .collect(Collectors.toList());
    }*/

/*    @GetMapping("/employees/{id}")
    Resource<Employee> one(@PathVariable Long id) {
        String sql = "SELECT * FROM CUSTOMER WHERE ID = ?";

        return jdbcTemplate.queryForObject(sql, new Object[]{id}, new CustomerRowMapper());


        return this.jdbcTemplate.queryForObject("SELECT * FROM empleados WHERE empleadoID = ?").stream()
                .map((m) -> m.values().toString())
                .collect(Collectors.toList());
    }*/
}
