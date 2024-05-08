$(document).ready(function() {
  var HeroicMemory = {
    init: function(cards) {
      // Initialisation du jeu
      this.$game = $(".game");
      this.$modal = $(".modal");
      this.$overlay = $(".modal-overlay");
      this.$restartButton = $("button.restart");
      this.$flipText = $(".flips-text");
      this.cardsArray = $.merge(cards, cards);
      this.shuffleCards(this.cardsArray);
      this.setup();
      this.numFlips = 0;
    },

    shuffleCards: function(cardsArray) {
      // Mélanger les cartes
      this.$cards = $(this.shuffle(this.cardsArray));
    },

    setup: function() {
      // Configuration du jeu
      this.html = this.buildHTML();
      this.$game.html(this.html);
      this.$memoryCards = $(".card");
      this.binding();
      this.paused = false;
      this.guess = null;
    },

    binding: function() {
      // Gestion des événements
      this.$memoryCards.on("click", this.cardClicked);
      $(document).on("click", "button.restart", $.proxy(this.reset, this));
    },

    cardClicked: function() {
      // Gestion du clic sur une carte
      var _ = HeroicMemory;
      var $card = $(this);
      _.numFlips++;
      if (!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")) {
        $card.find(".inside").addClass("picked");
        if (!_.guess) {
          _.guess = $(this).attr("data-id");
        } else if (_.guess == $(this).attr("data-id") && !$(this).hasClass("picked")) {
          $(".picked").addClass("matched");
          var successSound = new Audio('./src/Kick.mp3');
          successSound.play();
          _.guess = null;
        } else {
          _.guess = null;
          _.paused = true;
          setTimeout(function() {
            $(".picked").removeClass("picked");
            HeroicMemory.paused = false;
          }, 500); // Réduire le temps à 500 millisecondes
        }
        if ($(".matched").length == $(".card").length) {
          _.win();
        }
      }
    },

    win: function() {
      // Gestion de la victoire
      this.paused = true;
      var pseudo = $("#pseudoInput").val();
      if (pseudo.trim() !== "") {
        this.saveToLeaderboard(pseudo, this.numFlips);
      }
      setTimeout(function() {
        HeroicMemory.showModal();
        HeroicMemory.$game.fadeOut();
      }, 1000);
    },

    saveToLeaderboard: function(pseudo, score) {
      // Sauvegarde du pseudo, du score et de la date dans le leaderboard
      var leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
      var entry = { pseudo: pseudo, score: score, dateTime: new Date().toISOString() };
      leaderboard.push(entry); // Ajoutez la date et l'heure actuelles
    
      // Triez d'abord par score décroissant
      leaderboard.sort(function(a, b) {
        if (a.score !== b.score) {
          return b.score - a.score;
        } else {
          // Si les scores sont identiques, triez par date et heure la plus récente
          return new Date(b.dateTime) - new Date(a.dateTime);
        }
      });
    
      // Gardez uniquement les 10 meilleurs résultats
      leaderboard = leaderboard.slice(0, 10);
      
      localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    },
    

    showModal: function() {
      // Affichage de la modal de fin de jeu
      var leaderboardHTML = this.getLeaderboardHTML(); // Récupération du leaderboard
      this.$overlay.show();
      this.$modal.html('<h2 class="winner">Vous avez réussi !</h2><h4 class="flips-text">Cartes Retournées</h4><h3 class="modal-leaderboard-title">Leaderboard</h3><ol class="modal-leaderboard">' + leaderboardHTML + '</ol><button class="restart">Recommencer ?</button>').fadeIn("slow");
    },
    
    hideModal: function() {
      // Masquage de la modal
      this.$overlay.hide();
      this.$modal.hide();
    },

    reset: function() {
      // Réinitialisation du jeu
      this.hideModal();
      this.shuffleCards(this.cardsArray);
      this.setup();
      this.$game.show("slow");
    },

    shuffle: function(array) {
      // Fonction de mélange aléatoire d'un tableau
      var counter = array.length,
        temp, index;
      while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
      }
      return array;
    },

    buildHTML: function() {
      // Génération du code HTML pour les cartes
      var frag = '';
      this.$cards.each(function(k, v) {
        frag += '<div class="card" data-id="' + v.id + '"><div class="inside">\
        <div class="front"><img src="' + v.img + '"\
        alt="' + v.name + '" /></div>\
        <div class="back"><img src="http://orig04.deviantart.net/e4c4/f/2011/045/6/0/wow_high_rez_icon_by_jocpoc-d39jgl5.png"\
        alt="WoW" /></div></div>\
        </div>';
      });
      return frag;
    },

    getLeaderboardHTML: function() {
      // Récupérer le leaderboard depuis le stockage local et générer le code HTML
      var leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
      leaderboard = leaderboard.slice(0, 10); // Limiter aux 10 premiers éléments
      var leaderboardHTML = "";
      leaderboard.forEach(function(player, index) {
        leaderboardHTML += player.pseudo + " - " + player.score + " flips<br>";
      });
      return leaderboardHTML;
    },
    
  };

  var cards = [{
    name: "Druid",
    img: "https://github.com/orourkek/Wow-Icons/blob/master/images/class/64/druid.png?raw=true",
    id: 3
  }, {
    name: "Hunter",
    img: "https://github.com/orourkek/Wow-Icons/blob/master/images/class/64/hunter.png?raw=true",
    id: 4
  }, {
    name: "Mage",
    img: "https://github.com/orourkek/Wow-Icons/blob/master/images/class/64/mage.png?raw=true",
    id: 5
  }, {
    name: "Priest",
    img: "https://github.com/orourkek/Wow-Icons/blob/master/images/class/64/priest.png?raw=true",
    id: 6
  }, {
    name: "Paladin",
    img: "https://github.com/orourkek/Wow-Icons/blob/master/images/class/64/paladin.png?raw=true",
    id: 7
  }, {
    name: "Rogue",
    img: "https://github.com/orourkek/Wow-Icons/blob/master/images/class/64/rogue.png?raw=true",
    id: 8
  }, {
    name: "Shaman",
    img: "https://github.com/orourkek/Wow-Icons/blob/master/images/class/64/shaman.png?raw=true",
    id: 9
  }, {
    name: "Warlock",
    img: "https://github.com/orourkek/Wow-Icons/blob/master/images/class/64/warlock.png?raw=true",
    id: 11
  }, {
    name: "Warrior",
    img: "https://github.com/orourkek/Wow-Icons/blob/master/images/class/64/warrior.png?raw=true",
    id: 12,
  }, ];


  $(document).ready(function() {
    // Afficher la PseudoModal et le bouton de réinitialisation en début de partie
    $("#pseudoModal").show();
    $("#resetLeaderboard").show();
    
    // Ajouter la logique de la PseudoModal et du bouton de réinitialisation ici...
  });

$(document).ready(function() {
    var backgroundMusic = document.getElementById("backgroundMusic");
    backgroundMusic.volume = 0.015;
    backgroundMusic.play();

    $("#pseudoSubmit").on("click", function() {
      var pseudo = $("#pseudoInput").val();
      var difficulty = $("#difficultySelect").val(); // Récupère la difficulté sélectionnée

      if (pseudo.trim() !== "") {
        $("#pseudoModal").hide(); // Masque la modal une fois que le pseudo et la difficulté ont été validés
        
        // Changer la couleur de fond en fonction de la difficulté sélectionnée
        if (difficulty === "heroic") {
          $("body").css("background-color", "pink"); // Couleur rose pour la difficulté héroïque
        } else if (difficulty === "mythic") {
          $("body").css("background-color", "gray"); // Couleur grise pour la difficulté mythique
        } else {
          $("body").css("background-color", ""); // Réinitialiser la couleur de fond par défaut
        }
        
        HeroicMemory.init(cards);
      }
    });

    $(document).on("click", function() {
      backgroundMusic.play();
      $(document).off("click");
    });
  });

  
  $(document).ready(function() {
    // Vérifiez si la PseudoModal est visible
    var isPseudoModalVisible = $("#pseudoModal").is(":visible");
    
    // Affichez le bouton de réinitialisation uniquement si la PseudoModal est visible
    if (isPseudoModalVisible) {
      $("#resetLeaderboard").show();
    }
    
    // Ajoutez un écouteur d'événements au bouton de réinitialisation
    $("#resetLeaderboard").on("click", function() {
      // Réinitialisez le leaderboard en vidant le cache ou les cookies
      localStorage.removeItem("leaderboard");
    });
  });

})();
