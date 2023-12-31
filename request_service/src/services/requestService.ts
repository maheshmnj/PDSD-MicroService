// src/services/requestService.ts
import pool from '../database/dbConfig';
import Request from '../models/Request';

const INSERT_REQUEST_QUERY = 'INSERT INTO requests (user_id, book_title, book_author, justification) VALUES ($1, $2, $3, $4) RETURNING *';
const SELECT_ALL_REQUESTS_QUERY = 'SELECT * FROM requests';
const UPDATE_REQUEST_STATE_QUERY = 'UPDATE requests SET status = $1 WHERE id = $2 RETURNING *';

class RequestService {
  static async submitRequest(user_id: number, book_title: string, book_author: string, justification: string): Promise<Request> {
    // Implement the logic to insert the request into the database
    const result = await pool.query(INSERT_REQUEST_QUERY, [user_id, book_title, book_author, justification]);
    return result.rows[0];
  }

  static async getRequests(): Promise<Request[]> {
    // Implement the logic to retrieve all requests from the database
    const result = await pool.query(SELECT_ALL_REQUESTS_QUERY);
    return result.rows;
  }

  static async updateRequestState(requestId: number, newState: 'approved' | 'rejected'): Promise<Request> {
    // Implement the logic to update the request state in the database
    const result = await pool.query(UPDATE_REQUEST_STATE_QUERY, [newState, requestId]);
    return result.rows[0];
  }
  // Add other service methods as needed
}

export default RequestService;
