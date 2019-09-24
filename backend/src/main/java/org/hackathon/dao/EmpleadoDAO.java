package org.hackathon.dao;

import org.hackathon.beans.Empleado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.stereotype.Component;

import java.util.List;

@Component("empleadoDAO")
public class EmpleadoDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // excluded table is used to reference values originally proposed for insertion
    public int updateEmpleado(Empleado empleado) {
        return jdbcTemplate.update(
                "INSERT INTO empleados (nombre, apellido) values (:nombre, :apellido) " +
                        "ON CONFLICT (:empleadoID) DO UPDATE SET nombre = EXCLUDED.nombre, apellido = EXCLUDED.apellido;",
                new BeanPropertySqlParameterSource(empleado));
    }

    public int[] batchUpdate(List<Empleado> empleados) {
        return jdbcTemplate.batchUpdate(
                "INSERT INTO empleados (nombre, apellido) values (:nombre, :apellido) " +
                        "ON CONFLICT (:empleadoID) DO UPDATE SET nombre = EXCLUDED.nombre, apellido = EXCLUDED.apellido;",
                new BatchPreparedStatementSetter() {
                    @Override
                    public void setValues(PreparedStatement ps, int i) throws SQLException {
                        ps.setInt(1, employees.get(i).getId());
                        ps.setString(2, employees.get(i).getFirstName());
                        ps.setString(3, employees.get(i).getLastName());
                        ps.setString(4, employees.get(i).getAddress();
                    }
                    @Override
                    public int getBatchSize() {
                        return 50;
                    }
                });
    }

    public List<Empleado> getEmpleados(String nombre) {
        return jdbcTemplate.query(
                "SELECT * FROM empleados WHERE nombre = ?",
                new Object[]{nombre},
                (rs, rowNum) ->
                        new Empleado(
                                rs.getString("nombre"),
                                rs.getString("apellido"),
                                rs.getLong("empleadoID")
                        )
        );
    }

    public List<Empleado> getEmpleados() {
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

    public Empleado getEmpleado(long empleadoID) {
        return jdbcTemplate.queryForObject(
                "SELECT * FROM empleados WHERE empleadoID = ?",
                new Object[]{empleadoID},
                (rs, rowNum) ->
                        new Empleado(
                                rs.getString("nombre"),
                                rs.getString("apellido"),
                                rs.getLong("empleadoID")
                        )
        );
    }
}