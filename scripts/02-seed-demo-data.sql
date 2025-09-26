-- Seed demo data for testing the MCQ study app
-- This includes sample questions from the specification

INSERT INTO sets (id, title, description) VALUES 
('set_demo', 'Demo CSA', 'Demonstração de questões de Ciência da Computação');

INSERT INTO questions (id, set_id, type, stem, explanation, select_count) VALUES 
('q_http_idempotent', 'set_demo', 'single', 'Qual método HTTP é idempotente por definição?', 'PUT é idempotente: múltiplas requisições produzem o mesmo efeito.', NULL),
('q_primes', 'set_demo', 'multi', 'Quais são números primos? (selecione 2)', '2 e 3 são primos entre as opções listadas.', 2);

INSERT INTO options (id, question_id, text, is_correct) VALUES 
-- Options for HTTP question
('o1', 'q_http_idempotent', 'POST', 0),
('o2', 'q_http_idempotent', 'PUT', 1),
('o3', 'q_http_idempotent', 'PATCH', 0),
('o4', 'q_http_idempotent', 'CONNECT', 0),
-- Options for primes question
('p2', 'q_primes', '2', 1),
('p3', 'q_primes', '3', 1),
('p4', 'q_primes', '4', 0),
('p5', 'q_primes', '5', 0);
