INSERT INTO autores(nome, idade) 
VALUES 
('Napoleon Hill', 45),
('Robert C. Martin', 50),
('Martin Fowler', 55),
('Erich Gamma', 60);

INSERT INTO livros(id_autor, nome, editora, genero, data_publicacao)
VALUES 
(1, 'Quem pensa enriquece', 'Citadel', 'Autoajuda', '2020-11-01'),
(1, 'Mais esperto que o Diabo', 'Citadel', 'Autoajuda', '2014-07-10'),
(2, 'Código limpo', 'Alta Books', 'Desenvolvimento de software', '2008-09-08'),
(2, 'Arquitetura limpa', 'Alta Books', 'Desenvolvimento de software', '2019-04-19'),
(3, 'Refatoração', 'Novatec', 'Desenvolvimento de software', '2020-04-30'),
(4, 'Padrões de Projetos', 'Bookman', 'Desenvolvimento de software', '2000-01-01');

INSERT INTO usuarios(nome, idade, email, telefone, cpf) 
VALUES 
('Aretha Montgomery', 30, 'augue.id.ante@odioAliquam.com', '83301247289', 80371350042),
('Camden H. Bartlett', 15, 'turpis.vitae.purus@risusDuisa.ca', '07351620035', 67642869061),
('Raja W. Coffey Thomas', 30, 'raja.feugiat@nonummy.com', '05326108887', 63193310034),
('Elton D. Olsen', 29, 'auctor@duiFuscediam.edu', '66367637073', 75670505018),
('Elmo K. Greer', 18, 'risus.Duis@eget.ca', '12382472542', 82539841031);

INSERT INTO emprestimos(id_usuario, id_livro) 
VALUES (1, 2), (2, 1), (3, 3), (3, 5), (4, 6), (5, 4), (3, 6);
