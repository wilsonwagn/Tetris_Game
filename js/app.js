document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')

    //Botões na tela:
    const buttonUp = document.querySelector("#botao-up");
    const buttonDown = document.querySelector("#botao-down");
    const buttonLeft = document.querySelector("#botao-left");
    const buttonRight = document.querySelector("#botao-right");
    //

    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'orange', 'yellow'
    ]

    let acabou = false
    const nickiminaj = document.querySelector(".myAudio")
    function tocarMusica() {
        nickiminaj.classList.add("playing")
        nickiminaj.classList.remove("paused")
        nickiminaj.play();
    }

      
    //Os Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
      ]
    
    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
      ]
    
    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
      ]
    
    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
      ]
    
    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
      ]
    
    let currentPosition = 4
    let currentRotation = 0

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
    

    // Escolhendo um tetromino aleatoriamente na primeira rodada:
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]
    
    // Desenhando a primeira rotação no primeiro tetromino
    function draw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]

        })
    }

    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''

        })
    }
    //  Fazendo o tetromino descer a cada segundo
    //timerId = setInterval(moveDown, 700)

    // atribuindo funções aos códigos-chave:
    function control(e) {
        if(e.keyCode === 37 && timerId) {
            moveLeft()
        } else if (e.keyCode === 38 && timerId) {
            rotate()
        } else if (e.keyCode === 39 && timerId) {
            moveRight()
        } else if (e.keyCode === 40 && acabou == false && timerId) {
            moveDown()
        }
    
    }    
        document.addEventListener('keydown', control)
    
    // Função de mover para baixo:
    function moveDown(){
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    // Função para congelar:
    function freeze(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
    
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }
    //Mova o tetromino para a esquerda, a menos que esteja na borda ou haja um bloqueio.
    function moveLeft(){
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        
        if(!isAtLeftEdge) currentPosition -= 1
        
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            currentPosition+=1
        }
        draw()
    }
        
    function moveRight(){
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

        if(!isAtRightEdge) currentPosition += 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition-=1
        }
        draw()
    }

    // CORRIGIR A ROTAÇÃO DOS TETROMINOS NA BORDA

    function isAtRight() {
        return current.some(index=> (currentPosition + index + 1) % width === 0)  
    }
        
    function isAtLeft() {
        return current.some(index=> (currentPosition + index) % width === 0)
    }


    function checkRotatedPosition(P){
        P = P || currentPosition       
        if ((P+1) % width < 4) {             
            if (isAtRight()){          
                currentPosition += 1   
                checkRotatedPosition(P) 
            }
        }
        else if (P % width > 5) {
            if (isAtLeft()){
                currentPosition -= 1
                checkRotatedPosition(P)
            }
        }
    }

    function rotate(){
        undraw()
        currentRotation ++
        if(currentRotation == current.length) {
            currentRotation = 0
        }
        
        current = theTetrominoes[random][currentRotation]
        checkRotatedPosition()
        draw()
    }

    // Mostrando o próximo tetromino no display:

    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0

    //os tetrominos sem rotações
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

    
    function displayShape() {
        displaySquares.forEach(square => {
          square.classList.remove('tetromino')
          square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach( index => {
          displaySquares[displayIndex + index].classList.add('tetromino')
          displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
      }

    startBtn.addEventListener('click', () => {
        tocarMusica()
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })
    function addScore() {
        for (let i = 0; i < 199; i +=width) {
          const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
    
          if(row.every(index => squares[index].classList.contains('taken'))) {
            score +=10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
              squares[index].classList.remove('taken')
              squares[index].classList.remove('tetromino')
              squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
          }
        }
      }
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
          scoreDisplay.innerHTML = 'Acabou, sua pontuação foi ' + score 
          acabou = true
          clearInterval(timerId)
        }
      }
    
    //Quando clicar no botão na tela:
    buttonUp.addEventListener("click", () => {
        if (timerId) rotate();
    });

    buttonLeft.addEventListener("click", () => {
        if (timerId) moveLeft();
    });

    buttonRight.addEventListener("click", () => {
        if (timerId) moveRight();
    });

    buttonDown.addEventListener("click", () => {
        if (timerId) moveDown();
    });
    //

})