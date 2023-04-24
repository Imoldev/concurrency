enum TeamsList {
  red,
  green,
}

export type Teams = keyof typeof TeamsList; 
