CREATE SCHEMA IF NOT EXISTS board_games;
SET search_path TO board_games;

-- GAME table
CREATE TABLE IF NOT EXISTS game
(
  bgg_id           INTEGER PRIMARY KEY,
  name             VARCHAR(50)   NOT NULL UNIQUE,
  rating_bgg       NUMERIC(3, 2) NOT NULL,
  rating_personal  INTEGER       NULL,
  playing_time_min INTEGER       NOT NULL,
  playing_time_max INTEGER       NOT NULL,
  complexity       NUMERIC(3, 2) NOT NULL,
  players_min      INTEGER       NOT NULL,
  players_max      INTEGER       NOT NULL,
  players_rec_min  INTEGER       NOT NULL,
  players_rec_max  INTEGER       NOT NULL,
  main_game_id     INTEGER       NULL,

  CONSTRAINT fk_game_main_game
    FOREIGN KEY (main_game_id)
      REFERENCES game (bgg_id)
      ON DELETE RESTRICT,

  -- Basic sanity checks
  CONSTRAINT chk_playing_time_range
    CHECK (playing_time_min >= 0 AND playing_time_max >= playing_time_min),

  CONSTRAINT chk_players_range
    CHECK (players_min >= 1 AND players_max >= players_min),

  CONSTRAINT chk_players_rec_range
    CHECK (players_rec_min >= 1 AND players_rec_max >= players_rec_min),

  CONSTRAINT chk_players_rec_within_players
    CHECK (players_rec_min >= players_min AND players_rec_max <= players_max),

  CONSTRAINT chk_ratings
    CHECK (
      rating_bgg >= 1 AND rating_bgg < 10 AND
      (rating_personal IS NULL OR (rating_personal >= 1 AND rating_personal <= 10))
      ),

  CONSTRAINT chk_complexity
    CHECK (complexity >= 1 AND complexity <= 5)
);

-- PLAY table
CREATE TABLE IF NOT EXISTS play
(
  bgg_id    INTEGER NOT NULL,
  played_on DATE    NOT NULL,

  CONSTRAINT pk_play PRIMARY KEY (bgg_id, played_on),

  CONSTRAINT fk_play_game
    FOREIGN KEY (bgg_id)
      REFERENCES game (bgg_id)
      ON DELETE CASCADE
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_game_main_game_id ON game (main_game_id);
CREATE INDEX IF NOT EXISTS idx_play_bgg_id ON play (bgg_id);
CREATE INDEX IF NOT EXISTS idx_play_played_on ON play (played_on);
