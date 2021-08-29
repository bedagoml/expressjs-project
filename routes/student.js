var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

// display student page
router.get('/', function(req, res, next) {

    dbConn.query('SELECT * FROM student ORDER BY id desc', function(err, rows) {

        if (err) {
            req.flash('error', err);
            // render to views/student/index.ejs
            res.render('student', { data: '' });
        } else {
            // render to views/student/index.ejs
            res.render('student', { data: rows });
        }
    });
});

// display add student page
router.get('/add', function(req, res, next) {
    // render to add.ejs
    res.render('student/add', {
        name: '',
        tutor: ''
    })
})

// add a new student
router.post('/add', function(req, res, next) {

    let name = req.body.name;
    let tutor = req.body.tutor;
    let errors = false;

    if (name.length === 0 || tutor.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and tutor");
        // render to add.ejs with flash message
        res.render('student/add', {
            name: name,
            tutor: tutor
        })
    }

    // if no error
    if (!errors) {

        var form_data = {
            name: name,
            tutor: tutor
        }

        // insert query
        dbConn.query('INSERT INTO student SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('student/add', {
                    name: form_data.name,
                    tutor: form_data.tutor
                })
            } else {
                req.flash('success', 'student successfully added');
                res.redirect('/student');
            }
        })
    }
})

// display edit student page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('SELECT * FROM student WHERE id = ' + id, function(err, rows, fields) {
        if (err) throw err

        // if student not found
        if (rows.length <= 0) {
            req.flash('error', 'Student not found with id = ' + id)
            res.redirect('/student')
        }
        // if student found
        else {
            // render to edit.ejs
            res.render('student/edit', {
                title: 'Edit Student',
                id: rows[0].id,
                name: rows[0].name,
                tutor: rows[0].tutor
            })
        }
    })
})

// update student data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let tutor = req.body.tutor;
    let errors = false;

    if (name.length === 0 || tutor.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and tutor");
        // render to add.ejs with flash message
        res.render('student/edit', {
            id: req.params.id,
            name: name,
            tutor: tutor
        })
    }

    // if no error
    if (!errors) {

        var form_data = {
                name: name,
                tutor: tutor
            }
            // update query
        dbConn.query('UPDATE student SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                    // render to edit.ejs
                res.render('student/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    tutor: form_data.tutor
                })
            } else {
                req.flash('success', 'Student successfully updated');
                res.redirect('/student');
            }
        })
    }
})

// delete student
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('DELETE FROM student WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
                // redirect to student page
            res.redirect('/student')
        } else {
            // set flash message
            req.flash('success', 'student successfully deleted! ID = ' + id)
                // redirect to student page
            res.redirect('/student')
        }
    })
})

module.exports = router;