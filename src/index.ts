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
import { AluguelService } from "./service/AluguelService";
import { UsuarioDTO, UsuarioService } from "./service/UsuarioService";

async function loadTestDatabase(){
    const UserSerice = new UsuarioService(UsuarioRepository.getInstance());

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
    const userDTO = new UsuarioDTO('Felipe', 'felipe@gmail.com', '123456', '12345678999');   
    const user = new Usuario('Felipe', 'felipe@gmail.com', '123456', '12345678999');   
    const userSaved = await UserSerice.save(userDTO);    
    var aluguel = new Aluguel(user , [conta], 1);
    aluguel = AluguelRepository.getInstance().save(aluguel) as Aluguel;
}

export default loadTestDatabase;