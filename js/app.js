
const app = {
    state: {
        currentStage: 'game',
        score: 0,
        currentTime: '3.00',
        problemTimer: 30,
        gameTimer: 180,
        currentMathProblem: '3x5',
        factor: 3
    },
    elements: {
        stage: document.querySelector('.center-stage'),
        input: document.querySelector('input[type="tel"'),
        score: document.querySelector('.score'),
        time: document.querySelector('.time')
    },
    confetti: null,
    setup(){
        this.confetti = new JSConfetti();

        this.elements.input.focus();
        this.elements.input.addEventListener('keyup', (e) => this.evalAnswer(e))
        this.elements.stage.style.animationDuration = `30s`;
        this.elements.stage.classList.add('active');

        const viewport = window.visualViewport;
        const footerHeight = document.querySelector('section > footer').offsetHeight;

        viewport.addEventListener('resize', () => {
            this.elements.stage.style.height = viewport.height - footerHeight;
        })
    },
    render(){
        // show container
        document.querySelectorAll('main > section').forEach(el => el.style.display = 'none');
        document.querySelector(`section#${this.state.currentStage}`).style.display = 'flex';

        // update Clock
        this.elements.score.innerHTML = `${this.state.score}p`;
        document.querySelector('.time').innerHTML = `<p>${this.state.currentTime}s</p>`;
    
        this.elements.stage.innerText = this.state.currentMathProblem;

    },
    getMathProblem(){
        const rand = Math.round(Math.random()*10);
        this.state.currentMathProblem = `${this.state.factor}x${rand}`;
    },
    gameTimer: null,
    problemTimer: null,
    evalAnswer(e){
        const userAnswer = this.elements.input.value;

        console.info('Evaluation answer');
        
        const converted = this.state.currentMathProblem.replace('x', '*');
        const correctAnswer = eval(converted);
        
        if(+userAnswer === correctAnswer){
            console.info('Corrent answer!');
            this.confetti.addConfetti();
            this.state.score += this.state.problemTimer;
            this.elements.stage.classList.add('correct');
            this.resetProblemTimer()
            this.render()
            setTimeout(() => {
                this.elements.input.value = '';
                this.elements.input.focus();

            },250)
            
            setTimeout(() => {
                this.elements.stage.classList.remove('correct');
                this.getMathProblem();                
                this.render();
            },1000)

        } else {
            console.info('Wrong answer!');
            // no win
        }
    },
    startGameTimer(){
        this.gameTimer = setInterval(() => {
            if(this.state.gameTimer > 0){
                this.state.gameTimer--
                const minutes = Math.floor(this.state.gameTimer / 60);
                const seconds = this.state.gameTimer - minutes * 60;
                this.state.currentTime = `${minutes}.${seconds}`;
                this.render();
            } else {
                this.stopTimer();
                this.state.currentStage = 'game-over';
                this.render();
            }
        }, 1000)
    },
    startProblemTimer(){
        this.problemTimer = setInterval(() => {
            if(this.state.problemTimer > 0){
                this.state.problemTimer--
                console.log(this.state.problemTimer)
            } else {
                this.state.problemTimer = 0;
            }
        }, 1000)    
    },
    stopGameTimer(){
        clearInterval(this.gameTimer)
    },
    resetProblemTimer(){
        this.state.problemTimer = 30;
    },
    resetGameTimer(){
        this.state.currentTime = '3.00'
        this.state.gameTimer = 180;
    }
}

app.setup();
app.render();
app.startGameTimer()
app.startProblemTimer()