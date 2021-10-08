// Game TicTacToe v 1.0.0
// By MotivoArt Sławomir Smyk

class gameTicTacToe {
      constructor(options = {}) {
          // Default options 
          this.defaultOptions = {
            container: 'body', // id, class or html element
            width: '500px', // px 
            height: '500px', // px 
            boardColor: '#000000',
            cellColor: '#ffffff',
            wheelColor: '#107d1d',
            crossColor: '#db000e',
          }
  
          // Board
          this.board;
  
          // Set init options as default
          this.options = this.defaultOptions;
  
          // Get user options
          this.userOptions = options;
  
          // Override options with given
          this.options = Object.assign(this.options, this.userOptions);

          // Get container
          this.container = document.querySelector(this.options.container);

          // Create Scoreboard
          this.scoreboard = [null, null, null, null, null, null, null, null, null];

          // Winner Combinations
          this.combinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7 ,8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
          ]

          // Users
          this.user = 0 // 0 - is wheel, 1 - is cross
  
          // if container exists init all basic functionalities
          if (this.container) {
            this.init();
          }
      }


      /**
       * Init all basic functionalities
      */
      init() {

        // Create board
        this.createBoard(this.container);
        

        // If click active cell

        const cells = this.board.querySelectorAll('[data-item="cell"]');

        cells.forEach((cell) => {

          cell.addEventListener('click', (e) => {
            const currentUser = this.user;
            let shape = false;

            // Check user and create shape
            currentUser == 0 ? shape = this.createWheel(cell) : shape = this.createCross(cell);
            currentUser == 0 ? this.user = 1 : this.user= 0;

            // Save to scoreboard
            this.scoreboard[cell.dataset.id] = currentUser;

            // Add to cell
            this.addToCell(shape, cell);

            // Check that is winner
            if (this.checkForWin(currentUser)) {
              setTimeout(() => {
                const winner = currentUser == 0 ? "O" : "X";
                const restart = confirm(`${winner} is the winner! restart?`);

                if (restart) {
                  this.clearBoard();
                }
              },100);
            }

            // If draw
            if (this.checkForDraw()) {
              setTimeout(() => {
                const restart = confirm(`It's a draw! restart?`);

                if (restart) {
                  this.clearBoard();
                }
              },100);
            }

          });

        });
      }

      /**
       * Create board game
       * @param  {HTMLElement} container
       */
      createBoard(container) {

        // create new div
        this.board = document.createElement('div');

        // Add styles
        this.board.style.width = this.options.width;
        this.board.style.height = this.options.height;
        this.board.style.backgroundColor = this.options.boardColor;
        this.board.style.display = 'grid';
        this.board.style.gridTemplateColumns = '32% 32% 32%';
        this.board.style.gridTemplateRows = '32% 32% 32%';
        this.board.style.gridGap = '2%';

        // Insert cells to board
        for (let i = 0; i < 9; i++) {
          this.board.insertAdjacentElement('beforeend', this.createCell(i));
        }

        // Insert board to container
        container.insertAdjacentElement('afterbegin', this.board);


      }
      
      /**
       * Check that active user is winner
       */
      checkForWin(user) {
        return this.combinations.some(combination => {
          return combination.every(c => {
            if(this.scoreboard[c] == user) {
              return true
            }

            return false;
          })
        })
      }
 
      /**
       * Check that if a draw
       */
      checkForDraw() {
        return this.scoreboard.every(c => {
          if (c == 0 || c == 1) {
            return true;
          }

          return false;
        });
      }
      
      /**
       * creates cells and sets them on the board
       */
      createCell(index) {
        const cell = document.createElement('button');

        // Add styles
        cell.style.backgroundColor = this.options.cellColor;
        cell.style.position = 'relative';
        cell.style.border = '0';
        cell.style.cursor = 'pointer';
        cell.style.padding = '0';
        cell.setAttribute('data-id', index);
        cell.setAttribute('data-item', 'cell');
        cell.setAttribute('data-active', 'true');

        return cell;

      }

      /**
       * create wheel
       */
      createWheel(cell) {
        // Create canvas element
        const canvas = document.createElement('canvas');

        // Add width and height
        canvas.setAttribute('width', cell.offsetWidth);
        canvas.setAttribute('height', cell.offsetHeight);

        // Define coordinates
        const coordinate = cell.offsetWidth >= cell.offsetHeight ? cell.offsetHeight/2 : cell.offsetWidth/2;

        // Define x,y
        const x = cell.offsetWidth / 2;
        const y = cell.offsetHeight / 2;
        
        // Get context
        const wheel = canvas.getContext('2d');
        
        // Line width
        wheel.lineWidth = 5;
        wheel.beginPath();

        // Draw Wheel
        wheel.arc(x, y, coordinate - (coordinate / 5), 0, Math.PI * 2);

        // Stroke style
        wheel.strokeStyle = this.options.wheelColor;
        wheel.stroke();

        return canvas;
      }

      /**
       * create cross
       */
      createCross(cell) {
        // Create canvas element
        const canvas = document.createElement('canvas');

        // Add width and height
        canvas.setAttribute('width', cell.offsetWidth);
        canvas.setAttribute('height', cell.offsetHeight);
        
        // Get context
        const cross = canvas.getContext("2d");
        cross.beginPath();

        // Define x,y
        const x = cell.offsetWidth / 2;
        const y = cell.offsetHeight / 2;

        // line length
        const line_length = x - (x / 5);

        // Line width
        cross.lineWidth = 5;
    
        // Draw first linne
        cross.moveTo(x - line_length, y - line_length);
        cross.lineTo(x + line_length, y + line_length);
        cross.stroke();

        // Draw second linne
        cross.moveTo(x + line_length, y - line_length);
        cross.lineTo(x - line_length, y + line_length);

        // Stroke style
        cross.strokeStyle = this.options.crossColor;
        cross.stroke();

        return canvas;
      }

      /**
       * Add shape in to cell 
       */
      addToCell(shape, cell) {

          // Add shape to cell
          cell.insertAdjacentElement('afterbegin', shape);
  
          // Disable cell
          cell.setAttribute('disabled', 'disabled');
          
      }

      /**
       * clear all cells on board 
       */
      clearBoard() {
        // Clear scoreboard
        this.scoreboard = [null, null, null, null, null, null, null, null, null];

        const cells = this.board.querySelectorAll('[data-item="cell"]');

        cells.forEach((cell) => {
          // Clear cell
          cell.innerHTML = '';

          // Undisable cell
          cell.removeAttribute('disabled');
        });

        // Restart custom user
        this.user = 0;
      }

}
export default gameTicTacToe;
