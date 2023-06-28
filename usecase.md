Casos de uso

Caso de uso 1: Cadastrar Usuário
Pré-condições
e-mail e cpf não podem estar cadastrados;
Fluxo principal
Usuário preenche os dados básicos: e-mail, nome, cpf e senha;
Fluxo alternativo
O sistema informa que o CPF ou e-mail já estão em uso.

Caso de uso 2: Cadastrar uma plataforma
Pré-condições
O usuário que cadastra precisa ser administrador;
O título não pode ser duplicado;
Fluxo principal
O usuário informa o título e salva;
Fluxo alternativo
O sistema informa que o título já está cadastrado

Caso de uso 3: Cadastrar um jogo
Pré-condições
o usuário que cadastra precisa ser administrador;
O título não pode ser duplicado;
Pelo menos uma plataforma precisa ser vinculada ao jogo;
Fluxo principal
O usuário informa o título do jogo;
O usuário vincula pelo menos uma plataforma;
O usuário informa a URL da imagem do jogo;
Informa o valor do aluguel para 1 período;
Fluxo alternativo
O sistema informa que o título já está cadastrado;
O sistema solicita que ao menos uma plataforma seja vinculada ao jogo;
O sistema solicita que o valor do aluguel seja informado;

Caso de uso 4: Cadastrar uma conta
Pré-condições
o usuário que cadastra precisa ser administrador;
O e-mail da conta não pode ser duplicado;
Fluxo principal
O usuário informa o email da conta;
O usuário vincula pelo menos um jogo à conta;
O usuário seleciona a plataforma do jogo;
Fluxo alternativo
O sistema informa que o e-mail já está cadastrado;
O sistema solicita que ao menos um jogo seja vinculado à conta;
O sistema informa que a plataforma precisa ser selecionada;

Caso de uso 5: Alugar um jogo
Pré condições
É necessária que haja uma conta disponível para aluguel com o jogo e a plataforma selecionada;
É necessário que o cliente defina o período do aluguel (semanas) sendo 1 o mínimo;
Fluxo principal
O usuário seleciona o jogo e a plataforma desejada;
O pagamento precisa ser confirmado (apenas para ilustrar);
O sistema envia um e-mail ao usuário com os dados da conta com o jogo;
O sistema encerra o aluguel ao fim do prazo e atribui uma nova senha para a conta.
Fluxo alternativo
O sistema não exibe os jogos que não tem conta disponível para aluguel na plataforma desejada;
O sistema confirma o aluguel e o envio do e-mail com os dados da conta.
