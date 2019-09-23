package org.hackathon.controllers;

import org.hackathon.beans.DataBean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.atomic.AtomicLong;

@RestController
public class DataBeanController {

 /*   private final JdbcTemplate jdbcTemplate;

    public WebController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    	@GetMapping("/getTuples")
	public List<String> getTuples() {
		return this.jdbcTemplate.queryForList("SELECT * FROM users").stream()
				.map((m) -> m.values().toString())
				.collect(Collectors.toList());
	}

docker run -it --rm --network some-network postgres psql -h some-postgres -U postgres

    */

    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();

    @RequestMapping(name = "greeting", method = RequestMethod.GET)
    public DataBean greeting(@RequestParam(value="name", defaultValue="World") String name) {
        return new DataBean(counter.incrementAndGet(), String.format(template, name));
    }
}
