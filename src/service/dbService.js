import { dbPool } from '../database/postgreSQL.js';

const dbService = {
  async insert(table, columns, values) {
    const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING *;`;
    try {
      const { rows } = await dbPool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Insert operation failed:', error);
      throw error;
    }
  },

  async select(table, columns, condition = '', values = []) {
    const query = `SELECT ${columns.join(', ')} FROM ${table} ${condition}`;
    try {
      const { rows } = await dbPool.query(query, values);
      return rows;
    } catch (error) {
      console.error('Select operation failed:', error);
      throw error;
    }
  },

  async update(table, updates, condition, params) {
    const setParts = Object.keys(updates).map(
      (key, idx) => `${key} = $${idx + 1}`,
    );
    const values = [...Object.values(updates), ...params];
    const query = `UPDATE ${table} SET ${setParts.join(', ')} WHERE ${condition} RETURNING *;`;

    try {
      const { rows } = await dbPool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Update operation failed:', error);
      throw error;
    }
  },

  async delete(table, condition) {
    const query = `DELETE FROM ${table} WHERE ${condition} RETURNING *;`;
    try {
      const { rows } = await dbPool.query(query);
      return rows[0];
    } catch (error) {
      console.error('Delete operation failed:', error);
      throw error;
    }
  },
};

export default dbService;
