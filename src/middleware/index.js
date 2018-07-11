import { Router } from 'express';

export default ({ config, db }) => {
	let routes = Router();

	// add middleware here

	//VIEW TODO BY ID
	routes.get('/todo/:id', (req, res) => {
		db.get("SELECT id, subject, content, priority FROM todo WHERE id = ?", req.params.id, (err, row) => {
			if(err) throw err
			res.send(row);
		})
	})

	//VIEW ALL TODO
	routes.get('/todo-all', (req, res) => {
		db.all("SELECT id, subject, content, priority FROM todo", (err, rows) => {
			if(err) throw err
			res.send(rows);
		})
	})

	//VIEW TODO RANKED BY PRIORITY
	routes.get('/todo-rank-priority', (req, res) => {
		db.all("SELECT id, subject, content, priority FROM todo ORDER BY priority", (err, rows) => {
			if(err) throw err
			res.send(rows);
		})
	})

	//VIEW TODO BY PRIORITY
	routes.get('/todo-priority/:priority', (req, res) => {
		db.all("SELECT id, subject, content, priority FROM todo WHERE priority = ?", req.params.priority, (err, rows) => {
			if(err) throw err
			res.send(rows);
		})
	})

	//ADD TODO
	routes.post('/todo-add', (req, res) => {
		db.run("INSERT INTO todo(priority,subject,content,datestamp) VALUES (?, ?, ?, ?)", [req.body.priority, req.body.subject, req.body.content, Date.now()], (err) => {
			if(err) throw err
			res.send("ADDED SUCCESSFULLY")
		})
	})

	//UPDATE TODO
	routes.put('/todo-update/:id', (req, res) => {
		db.run("UPDATE todo SET priority=?, subject=?, content=?, datestamp=? WHERE id=?", [req.body.priority, req.body.subject, req.body.content, Date.now(), req.params.id], (err) => {
			if(err) throw err
			db.get("SELECT id, subject, content, priority FROM todo WHERE id = ?", req.params.id, (err, row) => {
				if(err) throw err
				res.send(row);
			})
		})
	})

	//DELETE ALL TODO
	routes.delete('/todo-remove-all', (req, res) => {
		db.all("SELECT id, subject, content, priority FROM todo", (err, rows) => {
			if(err) throw err
			db.run("DELETE FROM todo", (err) => {
				if(err) throw err
			})
			res.send(rows)
		})
	})

	//DELETE TODO BY ID
	routes.delete('/todo-remove/:id', (req, res) => {
		db.get("SELECT id, subject, content, priority FROM todo WHERE id = ?", req.params.id, (err, row) => {
			if(err) throw err
			db.run("DELETE FROM todo WHERE id=?", req.params.id, (err) => {
				if(err) throw err
			})
			res.send(row)
		})
	})

	return routes;
}
