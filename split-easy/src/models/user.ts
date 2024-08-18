import pool from "../db";

interface UserInterface {
  id?: number;
  username: string;
  createdAt?: string;
}

export class User implements UserInterface {
  id: number;
  username: string;
  createdAt: string;
  constructor(props: UserInterface) {
    this.createdAt = props.createdAt;
    this.id = props.id;
    this.username = props.username;
  }

  addUser = async () => {
    await pool.query(`INSERT INTO users(username) VALUES ('${this.username}')`);
  };
}
