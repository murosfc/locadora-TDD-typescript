import { Aluguel } from "./model/Aluguel";
import { Conta } from "./model/Conta";
import { Jogo } from "./model/Jogo";
import { Plataforma } from "./model/Plataforma";
import { Usuario } from "./model/Usuario";
import { AluguelRepository } from "./repositories/InMemoryRepository/AluguelRepository";
import { ContaRepository } from "./repositories/InMemoryRepository/ContaRepository";
import { JogoRepository } from "./repositories/InMemoryRepository/JogoRepository";
import { PlataformaRepository } from "./repositories/InMemoryRepository/PlataformaRepository";
import { UsuarioRepository } from "./repositories/InMemoryRepository/UsuarioRepository";

function loadTestDatabase(){
    var plataforma = new Plataforma("PS5");
    plataforma = PlataformaRepository.getInstance().save(plataforma);
    var jogo = new Jogo("God of War", plataforma, 25, "");
    jogo = JogoRepository.getInstance().save(jogo) as Jogo;
    var jogo2 = new Jogo("Horizon Zero Dawn", plataforma, 20, "");
    jogo2 = JogoRepository.getInstance().save(jogo2) as Jogo;
    var conta = new Conta("conta01@ongames.com", "123456", [jogo]);
    conta = ContaRepository.getInstance().save(conta) as Conta;
    var conta2 = new Conta("conta02@ongames.com", "123456", [jogo2]);
    conta2 = ContaRepository.getInstance().save(conta2) as Conta;
    var usuario = new Usuario("Felipe", "felipe@gmail.com", "123456", "11223445565");
    usuario = UsuarioRepository.getInstance().save(usuario);
    var aluguel = new Aluguel(usuario, [conta], 1);
    aluguel = AluguelRepository.getInstance().save(aluguel) as Aluguel;
}

export default loadTestDatabase;