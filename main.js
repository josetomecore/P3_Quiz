const readline = require('readline');
const model = require('./model');
const {log, biglog, errorlog, colorize} = require("./out");
const cmds = require("./cmds");




/*console.log(
  chalk.green.bold( 
    figlet.textSync('Core Quiz', {horizontalLayout: 'full'})
    )
  );*/

biglog('Core Quiz','green');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt:colorize("quiz >",'blue'),
  completer : (line) =>{
  const completions = 'h help show add delete edit list test p play credits q quit'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // show all completions if none found
  return [hits.length ? hits : completions, line];
}
});

rl.prompt();

rl.
on('line',(line) => {


  let args = line.split(" ");
  let cmd = args[0].toLowerCase().trim();


  switch (cmd) {
    case '':
    rl.prompt();
    break;
    
    case 'h':
    case 'help':
    /* console.log("Comandos!");
      console.log("h/help - muestra ayuda");
      console.log("list - listar los quizzes existentes");
      console.log("show <id> - muestra la pregunta y la respuesta el quiz indicado por el id");
      console.log("add - añadir un nuevo quiz interactivamente");
      console.log("delete <id> - borra el quiz indicado");
      console.log("edir <id> - editar el quiz indicado");
      console.log("test <id> - probar el quiz indicado");
      console.log("p/play - jugar con preguntasaleatorias de todos los quizes");
      console.log("credits - creditos");
      console.log("q/quit - salir del programa");*/
      cmds.helpCmd(rl);
      break;

    case 'quit':
    case 'q':
    /*rl.close();*/
     cmds.quitCmd(rl);
    break;

    case 'add':
    /*console.log('añadir un nuevo quiz');*/
     cmds.addCmd(rl);
    break;

    case 'list':
    /*console.log('listar todos los quiezes');*/
     cmds.listCmd(rl);
    break;

    case 'show':
    /*console.log('mostrar el quiz indicado');*/
    cmds.showCmd(rl,args[1]);
    break;

    case 'test':
    /*console.log('probar quiz indicado');*/
     cmds.testCmd(rl,args[1]);
    break;

    case 'play':
    case 'p':
    /*console.log('jugar');*/
     cmds.playCmd(rl);
    break;

    case 'delete':
    /*console.log('borrar el quiz indicado');*/
    cmds.deleteCmd(rl,args[1]);
    break;

    case 'edit':
    /*console.log('editar el quiz indicado');*/
     cmds.editCmd(rl,args[1]);
    break;

    case 'credits':
    /*console.log('autores de la practica');
    console.log('nombre 1');
    console.log('nombre 2');*/
     cmds.creditsCmd(rl);
    break;

    default:
 console.log(`Say what? I might have heard '${colorize(cmd,'red')}'`);
    console.log(`use'${colorize('help','green')}' para ver todos los comandos`);
   rl.prompt();
    break;
}

  
}).on('close', () => {
  log('adios');
  process.exit(0);
});

