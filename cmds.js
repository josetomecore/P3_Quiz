
const Sequelize = require('sequelize');
const {log, biglog, errorlog, colorize} = require("./out");
const {models} = require('./model');


exports.helpCmd=rl=>{

    log('Comandos!','red');
      log('h/help - muestra ayuda','red');
     log('list - listar los quizzes existentes','red');
     log('show <id> - muestra la pregunta y la respuesta el quiz indicado por el id','red');
      log('add - añadir un nuevo quiz interactivamente','red');
      log('delete <id> - borra el quiz indicado','red');
      log('edir <id> - editar el quiz indicado','red');
      log('test <id> - probar el quiz indicado','red');
      log('p/play - jugar con preguntasaleatorias de todos los quizes','red');
      log('credits - creditos','red');
      log('q/quit - salir del programa','red');
      rl.prompt();
     };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 exports.quitCmd=rl=>{
    
rl.close();
    rl.prompt();
   };
 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const makeQuestion = (rl, text) => {


        return new Sequelize.Promise((resolve, reject) => {

            rl.question(colorize(text, 'red'), answer =>{
        resolve(answer.trim());
});
});
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    exports.addCmd=rl=>{


        makeQuestion(rl, 'Introduzca una pregunta:')

        .then(q=> {

            return makeQuestion(rl, 'Introduzca la respuesta')

                .then(a => {

                    return {question : q, answer:a};

});

})

        .then(quiz => {
            return models.quiz.create(quiz);

})

        .then((quiz) =>{

log(`${colorize('Se ha añadido','magenta')}: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);

})
           .catch(Sequelize, ValidationError, error => {

            errorlog('El quiz es erroneo:');
            error.errors.forEach(({message}) => errorlog(message));
})  

.catch(error => {
       errorlog(error.message);
     })
    
    .then(()  => {   rl.prompt();

})
    };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  exports.listCmd=rl=>{

    models.quiz.findAll()
    .each(quiz => {

            log(`[${colorize(quiz.id, 'magenta')}]: ${quiz.question}`);

    })

    .catch(error => {

    errorlog(error.message);

    })
    .then(() => {

        rl.prompt();
    });
   };


    const validateId = id => {

        return new Sequelize.Promise((resolve,reject) => {

            if (typeof id === "undefined"){
                
                reject(new Error(`Falta el parametro <id>.`));
  
    
            }
            else{

                id=parseInt(id);

                if(Number.isNaN(id)){
                    reject(new Error(`El valor del parametro <id> no es un número.`));
    

                }
                else {
                    resolve(id);
    

             
                }

            }
})

};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   exports.showCmd=(rl,id)=>{

    validateId(id)
    .then(id => models.quiz.findById(id))
    .then(quiz => {

        if(!quiz){
            throw new Error(`No existe un quiz asociado al id = ${id}.`);

        }

        log(`[${colorize(quiz.id, 'magenta')}]: ${quiz.question}${colorize('=>', 'red')}`)
    
    })
     
    .catch(error => {
       errorlog(error.message);
     })
    
    .then(()  => {   rl.prompt();

})
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   
    exports.testCmd=(rl,id)=>{
      
  
  
       validateId(id)
  
        .then(id => models.quiz.findById(id))

        
  
  .then(quiz => {
        if(!quiz){
        
            throw new Error(`No existe un quiz asociado al id = ${id}.`); 

}

  
  
    return makeQuestion(rl, quiz.question)

        .then ( a =>{

        if (quiz.answer===a) {

            console.log("Su respuesta es correcta");
    return;
    

        }
        else{

            console.log("Su respuesta es incorrecta");
    return;
    }
    
  
               
        });

})


    .catch(error => {
       errorlog(error.message);
  rl.prompt();
     }) 

.then(()  => {   rl.prompt();

})
  
    };
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    exports.playCmd=rl=>{

        let score = 0; 
      let contador = 4; 
        let toBeResolved=[]; 
      
            for (i=1; i<5; i++){ 
        
          toBeResolved[i-1]=i; 
 
            } 
       validateId(1)
        const play = () => { 

      return Promise.resolve()
      .then(() => {
       
        if(contador===0){ 
        
                  log(`Fin del juego. Aciertos ${colorize(score,'magenta')}`); 
 

             return;

            } 
              else{ 
          
                  let idaux= Math.round(Math.random()*(toBeResolved.length -1));
                  let id= toBeResolved[idaux];
  
                  validateId(id)
                  .then(id => models.quiz.findById(id))
                        .then(quiz => {

          toBeResolved.splice(idaux,1);
              contador --;    

              return makeQuestion(rl, quiz.question)
    
                .then ( a =>{

                  if (quiz.answer===a) {

                        score++; 
                        log(`Su respuesta es correcta. Aciertos ${colorize(score,'magenta')}`); 
                                return play();

                  }
                  else{

                        log(`Fin del juego. Su respuesta es incorrecta. Aciertos ${colorize(score,'magenta')}`); 

                          
            }           
                  })
                .then(() => {
   
    rl.prompt();
  })
                 })
    
       };  
  })
.then(() => {
   
    rl.prompt();
  });

        };




     play();
  


   };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   exports.deleteCmd=(rl,id)=>{

    validateId(id)

    .then(id => models.quiz.destroy({where: {id}}))

    .catch(error => {
       errorlog(error.message);
  rl.prompt();
     })
    
    .then(()  => { 
    
    rl.prompt();

})
    };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   exports.editCmd=(rl,id)=>{


        validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
        if(!quiz){
            throw new Error(`No existe un quiz asociado al id = ${id}.`);

        }
    process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);

    return makeQuestion(rl, 'Introduzca la pregunta:')
        
        .then (q => {
        process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);

    return makeQuestion(rl, 'Introduzca la respuesta:')

       .then(a => {
            quiz.question =q;
            quiz.answer=a;
            return quiz;
});
});
})

    .then(quiz => {

        return quiz.save();
})

    .then(quiz => {

        log(`Se ha cambiado el quiz ${colorize(quiz.id, 'magenta')} por: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);
    
    })

    .catch(Sequelize.ValidationError, error => {
errorlog('El quiz es erroneo:');
            error.errors.forEach(({message}) => errorlog(message));
})  

.catch(error => {
       errorlog(error.message);
     })
    
    .then(()  => {   rl.prompt();

})

         };
   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    exports.creditsCmd=rl=>{
    console.log("Jose Tome Mayo");
    console.log("josetomemayo");
    console.log("Susanacoiraserrano");

    rl.prompt();
};
