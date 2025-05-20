let gotas = [];
let solo;
let tipoSolo = "vegetacao"; // valor inicial
let passaros = []; // Array para armazenar os pássaros
let ventoForca = 0; // Força do vento
let folhas = []; // Array para armazenar as folhas

class Gota {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.vel = random(6, 8); // Aumenta a velocidade da chuva para o efeito de vento
    this.comprimento = random(12, 18); // Gotas de chuva mais longas
  }

  cair() {
    this.y += this.vel;
    this.x += ventoForca; // Movimento horizontal devido ao vento
  }

  mostrar() {
    stroke(0, 0, 200, 150); // Cor da chuva
    line(this.x, this.y, this.x, this.y + this.comprimento);
  }

  atingeSolo(ySolo) {
    return this.y > ySolo;
  }
}

class Solo {
  constructor(tipo) {
    this.tipo = tipo;
    this.altura = height - 80;
    this.erosao = 0;
    this.arvores = []; // Array para armazenar as árvores do solo
    this.alturaOriginal = this.altura; // Armazena a altura original do solo

    // Cria árvores para o solo de vegetação
    if (this.tipo === "vegetacao") {
      for (let i = 0; i < 5; i++) { // Cria 5 árvores
        let x = random(50, width - 50); // Posição x aleatória
        let y = this.altura;
        this.arvores.push(new Arvore(x, y));
      }
    }
  }

  aumentarErosao() {
    let taxa;
    if (this.tipo === "vegetacao") taxa = 0.1;
    else if (this.tipo === "exposto") taxa = 0.5;
    else if (this.tipo === "urbanizado") taxa = 0.3;

    this.erosao += taxa;
    this.altura += taxa;
  }

  mostrar() {
    noStroke();
    if (this.tipo === "vegetacao") fill(60, 150, 60);
    else if (this.tipo === "exposto") fill(139, 69, 19);
    else if (this.tipo === "urbanizado") fill(120);

    rect(0, this.altura, width, height - this.altura);

    // Mostra as árvores do solo
    for (let arvore of this.arvores) {
      arvore.mostrar(this.altura - this.alturaOriginal); // Passa a diferença de altura para a árvore
    }

    fill(0);
    textSize(14);
    textAlign(LEFT);
    text(`Erosão: ${this.erosao.toFixed(1)}`, 10, 20);
    text(`Tipo de solo: ${this.tipo}`, 10, 40);
  }
}

class Arvore {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alturaTronco = random(20, 50);
    this.larguraTronco = 10;
    this.diametroCopa = random(30, 60);
    this.corTronco = color(100, 50, 20);
    this.corCopa = color(0, 100, 0);
    this.folhas = []; // Array para armazenar as folhas da árvore
    let numFolhas = int(random(10, 20)); // Número de folhas por árvore
    for (let i = 0; i < numFolhas; i++) {
      this.folhas.push(new Folha(this.x + this.larguraTronco / 2, this.y - this.alturaTronco - this.diametroCopa / 2));
    }
  }

  mostrar(quedaSolo = 0) { // Adiciona o parâmetro quedaSolo com valor padrão 0
    // Tronco
    fill(this.corTronco);
    rect(this.x, this.y - this.alturaTronco + quedaSolo, this.larguraTronco, this.alturaTronco); // Aplica a queda do solo ao tronco

    // Copa
    fill(this.corCopa);
    ellipse(this.x + this.larguraTronco / 2, this.y - this.alturaTronco - this.diametroCopa / 2 + quedaSolo, this.diametroCopa, this.diametroCopa); // Aplica a queda do solo à copa

    // Mostra as folhas
    for (let folha of this.folhas) {
      folha.mostrar(quedaSolo); // Passa a queda do solo para as folhas
    }
  }
}

class Folha {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.tamanho = random(5, 10);
    this.cor = color(0, random(50, 100), 0, random(100, 200)); // Cor da folha com transparência
    this.angulo = random(TWO_PI); // Ângulo inicial aleatório
  }

  mostrar(quedaSolo = 0) { // Adiciona o parâmetro quedaSolo com valor padrão 0
    push();
    translate(this.x, this.y + quedaSolo); // Aplica a queda do solo à folha
    rotate(this.angulo);
    fill(this.cor);
    ellipse(0, 0, this.tamanho, this.tamanho * 0.6); // Forma da folha
    pop();
  }

  atualizar() {
    this.x += ventoForca * 0.5; // Movimento da folha influenciado pelo vento
    this.y += ventoForca * 0.2; // Movimento vertical suave
    this.angulo += ventoForca * 0.1 + 0.02; // Rotação da folha
    // Faz a folha reaparecer do outro lado da tela
    if (this.x > width + 10 || this.x < -10 || this.y > height + 10) {
      this.x = random(width);
      this.y = random(-50, height / 2);
    }
  }
}


class Passaro {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocidadeX = random(1, 3);
    this.tamanho = random(10, 20);
    this.cor = color(50, 150); // Cor do pássaro
  }

  voar() {
    this.x += this.velocidadeX + ventoForca * 0.5; // Pássaro influenciado pelo vento
    this.y += sin(frameCount * 0.05) * 0.5; // Movimento vertical suave
  }

  mostrar() {
    fill(this.cor);
    ellipse(this.x, this.y, this.tamanho, this.tamanho * 0.6); // Corpo
    ellipse(this.x - this.tamanho / 2, this.y - this.tamanho * 0.3, this.tamanho * 0.4, this.tamanho * 0.2); // Asa esquerda
    ellipse(this.x + this.tamanho / 2, this.y - this.tamanho * 0.3, this.tamanho * 0.4, this.tamanho * 0.2); // Asa direita
  }

  saiuDaTela() {
    return this.x > width;
  }
}

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("canvas-holder");
  solo = new Solo(tipoSolo); // Agora a classe Solo já foi definida

  // Cria alguns pássaros iniciais
  for (let i = 0; i < 3; i++) {
    passaros.push(new Passaro(random(width), random(50, 150)));
  }
}

function draw() {
  background(200, 220, 255); // céu azul claro

  desenharVento(); // Chama a função para desenhar o vento

  // Atualiza e mostra os pássaros
  for (let i = passaros.length - 1; i >= 0; i--) {
    passaros[i].voar();
    passaros[i].mostrar();
    if (passaros[i].saiuDaTela()) {
      passaros.splice(i, 1); // Remove pássaros que saíram da tela
    }
  }

  for (let i = gotas.length - 1; i >= 0; i--) {
    gotas[i].cair();
    gotas[i].mostrar();

    if (gotas[i].atingeSolo(solo.altura)) {
      solo.aumentarErosao();
      gotas.splice(i, 1);
    }
  }

  solo.mostrar();

  // Atualiza e mostra as folhas das árvores
  for (let arvore of solo.arvores) {
    for (let folha of arvore.folhas) {
      folha.atualizar(); // Atualiza a posição da folha
      folha.mostrar(); // Desenha a folha
    }
  }

  // Adiciona um novo pássaro aleatoriamente
  if (frameCount % 120 === 0) {
    passaros.push(new Passaro(0, random(50, 150)));
  }

  // Adiciona novas gotas de chuva
  if (frameCount % 5 === 0) { // Cria mais gotas de chuva
    gotas.push(new Gota());
  }

  // Aumenta e diminui a força do vento suavemente
  ventoForca = map(sin(frameCount * 0.02), -1, 1, 0.5, 3); // Varia de 0.5 a 3
}

function setSoilType(tipo) {
  tipoSolo = tipo;
  solo = new Solo(tipoSolo);
}

function desenharVento() {
  push();
  translate(width - 50, 50); // Posição do indicador de vento
  for (let i = 0; i < int(ventoForca * 5); i++) { // Desenha linhas representando o vento
    let comprimento = map(i, 0, 15, 10, 30); // Comprimento das linhas
    let angulo = map(i, 0, 15, -PI / 6, PI / 6); // Ângulo das linhas
    stroke(128, 128, 128, 100 + i * 10); // Cor e transparência das linhas
    line(0, 0, comprimento, 0);
    rotate(angulo);
  }
  pop();
}
