INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Liz', 'Lemon', 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Pete', 'Hornberger', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jenna', 'Maroney', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Tracy', 'Jordan', 4, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Kenneth', 'Parcell', 3, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Grizz', 'Griswold', 5, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jack', 'Donaghy', 6, null);

INSERT INTO department (department_name)
VALUES ('Executive Level Management');
INSERT INTO department (department_name)
VALUES ('Skit Writers');
INSERT INTO department (department_name)
VALUES ('Skit Performers');
INSERT INTO department (department_name)
VALUES ('Featured Performer');
INSERT INTO department (department_name)
VALUES ('Cast Ego Support');

INSERT INTO role (title, salary, department_id)
VALUES ('Head Writer', 750000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Skit Writer', 85000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Lead Performer', 725000, 4);
INSERT INTO role (title, salary, department_id)
VALUES ('Skit Performer', 90000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ('Assistant to the Lead Performer', 80000, 5);
INSERT INTO role (title, salary, department_id)
VALUES ('Head of NBC', 2500000, null);