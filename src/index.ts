import { Aluguel } from "./model/Aluguel";
import { Conta } from "./model/Conta";
import { Jogo } from "./model/Jogo";
import { Plataforma } from "./model/Plataforma";
import { Usuario } from "./model/Usuario";
import { UsuarioTipoEnum } from "./model/enum/UsuarioTipoEnum";
import { AluguelRepository } from "./repositories/InMemoryRepository/AluguelRepository";
import { ContaRepository } from "./repositories/InMemoryRepository/ContaRepository";
import { JogoRepository } from "./repositories/InMemoryRepository/JogoRepository";
import { PlataformaRepository } from "./repositories/InMemoryRepository/PlataformaRepository";
import { UsuarioRepository } from "./repositories/InMemoryRepository/UsuarioRepository";
import { UsuarioDTO, UsuarioService } from "./service/UsuarioService";

async function loadTestDatabase(){
    const UserSerice = new UsuarioService(UsuarioRepository.getInstance());

    var plataforma = new Plataforma("PS5");
    plataforma = PlataformaRepository.getInstance().save(plataforma);
    var jogo = new Jogo("God of War", plataforma, 25, "https://cdn1.epicgames.com/offer/3ddd6a590da64e3686042d108968a6b2/EGS_GodofWar_SantaMonicaStudio_S2_1200x1600-fbdf3cbc2980749091d52751ffabb7b7_1200x1600-fbdf3cbc2980749091d52751ffabb7b7");
    jogo = JogoRepository.getInstance().save(jogo) as Jogo;
    var jogo2 = new Jogo("Horizon Zero Dawn", plataforma, 20, "https://image.api.playstation.com/vulcan/img/rnd/202009/2923/jAT7HjpL49A62bU7hLKXJ96b.png");
    jogo2 = JogoRepository.getInstance().save(jogo2) as Jogo;
    var conta = new Conta("conta01@ongames.com", "123456", jogo);
    conta = ContaRepository.getInstance().save(conta) as Conta;
    var conta2 = new Conta("conta02@ongames.com", "123456", jogo2);
    conta2 = ContaRepository.getInstance().save(conta2) as Conta;
    const userDTO = new UsuarioDTO('Felipe', 'felipe@gmail.com', '123456', '12345678999'); 
    userDTO.tipo = UsuarioTipoEnum.ADMINISTRADOR;  
    const user = new Usuario('Felipe', 'felipe@gmail.com', '123456', '12345678999');   
    var userSaved = await UserSerice.save(userDTO); 
    const userNew = new UsuarioDTO('Fernando', 'fernando@gmail.com', '123456', '12345678000'); 
    userSaved = await UserSerice.save(userNew );   
    var aluguel = new Aluguel(user , [conta], 1);
    aluguel = AluguelRepository.getInstance().save(aluguel) as Aluguel;
}

export default loadTestDatabase;