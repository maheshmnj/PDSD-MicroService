// controllers/checkoutController.ts

import { Request, Response } from 'express';
import CheckoutService from '../services/checkoutService';
import axios from 'axios';

class CheckoutController {

  static async checkoutBook(req: Request, res: Response): Promise<void> {
    try {
      const { userId, bookId, dueDate } = req.body;
      // Call the corresponding methods from CheckoutService
      const checkoutResult = await CheckoutService.checkoutBook(userId, bookId, dueDate);

      // Return the result
      res.json(checkoutResult);
    } catch (error: any) {
      console.error('Error in checkoutBook:', error.message);
      res.status(error.response?.status || 500).json({ error: error.message || 'Internal Server Error' });
    }
  }


  static async getAllCheckouts(req: Request, res: Response): Promise<void> {
    try {
      const checkouts = await CheckoutService.getAllCheckouts();
      res.json(checkouts);
    } catch (error) {
      console.error('Error in getAllCheckouts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getCheckoutById(req: Request, res: Response): Promise<void> {
    try {
      const checkoutId = parseInt(req.params.id, 10);
      if (isNaN(checkoutId) || checkoutId <= 0) {
        res.status(400).json({ error: 'Invalid checkout ID' });
        return;
      }

      const checkout = await CheckoutService.getCheckoutById(checkoutId);
      if (checkout) {
        res.json(checkout);
      } else {
        res.status(404).json({ error: 'Checkout not found' });
      }
    } catch (error) {
      console.error('Error in getCheckoutById:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getMostBorrowedBooks(req: Request, res: Response): Promise<void> {
    try {
      console.log('Getting most borrowed books');
      const mostBorrowedBooks = await CheckoutService.getMostBorrowedBooks();
      res.status(200).json(mostBorrowedBooks);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  static async getOverdueItems(req: Request, res: Response): Promise<void> {
    try {
      const overdueItems = await CheckoutService.getOverdueItems();

      res.status(200).json({
        message: 'Overdue Items Retrieved',
        data: overdueItems
      });
    } catch (error: any) {
      console.error(error);
      res.status(error.response?.status || 500).json({ error: error.message || 'Internal Server Error' });
    }
  }

  public static async placeHoldOnBook(req: Request, res: Response): Promise<void> {
    try {
      const bookId = parseInt(req.params.bookId, 10);
      const userId = req.body.userId;

      // Validate and sanitize inputs
      if (!userId || typeof userId !== 'number' || userId <= 0) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      if (!bookId || typeof bookId !== 'number' || bookId <= 0) {
        res.status(400).json({ error: 'Invalid book ID' });
        return;
      }

      // Call the corresponding methods from CheckoutService
      await CheckoutService.placeHoldOnBook(userId, bookId);

      // Return success
      res.status(200).json({ message: 'Hold placed successfully' });
    } catch (error) {
      console.error('Error in placeHoldOnBook:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async returnCheckoutItem(req: Request, res: Response): Promise<void> {
    try {
      const checkoutId = parseInt(req.params.checkoutId, 10);
      if (isNaN(checkoutId) || checkoutId <= 0) {
        res.status(400).json({ error: 'Invalid checkout ID' });
        return;
      }

      // Call the Checkouts service to handle the return
      const success = await CheckoutService.returnCheckoutItem(checkoutId);

      if (success) {
        res.json({ message: 'Checkout item returned successfully' });
      } else {
        res.status(500).json({ error: 'Failed to return checkout item' });
      }
    } catch (error) {
      console.error('Error in returnCheckoutItem:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async renewCheckoutItem(req: Request, res: Response): Promise<void> {
    try {
      const checkoutId = parseInt(req.params.checkoutId, 10);
      if (isNaN(checkoutId) || checkoutId <= 0) {
        res.status(400).json({ error: 'Invalid checkout ID' });
        return;
      }

      const newDueDate = new Date(req.body.newDueDate);
      if (isNaN(newDueDate.getTime())) {
        res.status(400).json({ error: 'Invalid new due date' });
        return;
      }


      await CheckoutService.renewCheckoutItem(checkoutId, newDueDate);
      res.json({ message: 'Checkout item renewed successfully' });
    } catch (error) {
      console.error('Error in renewCheckoutItem:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getUserCheckouts(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId, 10);
      if (isNaN(userId) || userId <= 0) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      const checkouts = await CheckoutService.getUserCheckouts(userId);
      res.json(checkouts);
    } catch (error) {
      console.error('Error in getUserCheckouts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getBookHolds(req: Request, res: Response): Promise<void> {
    try {
      const bookId = parseInt(req.params.bookId, 10);
      if (isNaN(bookId) || bookId <= 0) {
        res.status(400).json({ error: 'Invalid book ID' });
        return;
      }
      const holds = await CheckoutService.getBookHolds(bookId);
      res.json(holds);
    } catch (error) {
      console.error('Error in getBookHolds:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  static async getAllHolds(req: Request, res: Response): Promise<void> {
    try {
      const holds = await CheckoutService.getAllHolds();
      res.json(holds);
    } catch (error) {
      console.error('Error in getBookHolds:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default CheckoutController;
