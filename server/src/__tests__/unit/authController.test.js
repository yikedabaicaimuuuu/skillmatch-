import { jest } from '@jest/globals';

// Mock the AuthService before importing controller
const mockAuthService = {
  signup: jest.fn(),
  login: jest.fn(),
  getLoginDetail: jest.fn(),
  generateOtp: jest.fn(),
  changePassword: jest.fn()
};

jest.unstable_mockModule('../../services/auth.service.js', () => ({
  default: mockAuthService
}));

// Import controller after mocking
const { default: AuthController } = await import('../../controllers/auth.controller.js');

describe('AuthController', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      body: {},
      session: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
  });

  describe('signup', () => {
    it('should return 400 if email is missing', async () => {
      mockRequest.body = { fullName: 'Test User', password: 'password123' };

      await AuthController.signup(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error.status).toBe(400);
    });

    it('should return 400 if fullName is missing', async () => {
      mockRequest.body = { email: 'test@example.com', password: 'password123' };

      await AuthController.signup(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 400 if password is missing', async () => {
      mockRequest.body = { email: 'test@example.com', fullName: 'Test User' };

      await AuthController.signup(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 201 on successful signup', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'password123'
      };
      mockAuthService.signup.mockResolvedValue(true);

      await AuthController.signup(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'user registered successfully'
      });
    });

    it('should return 404 when signup fails', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'password123'
      };
      mockAuthService.signup.mockResolvedValue(false);

      await AuthController.signup(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe('login', () => {
    it('should return 400 if email is missing', async () => {
      mockRequest.body = { password: 'password123' };

      await AuthController.login(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 400 if password is missing', async () => {
      mockRequest.body = { email: 'test@example.com' };

      await AuthController.login(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 201 on successful login', async () => {
      mockRequest.body = { email: 'test@example.com', password: 'password123' };
      mockAuthService.login.mockResolvedValue({
        userId: 1,
        isAuthenticated: true
      });

      await AuthController.login(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockRequest.session.userId).toBe(1);
      expect(mockRequest.session.isAuthenticated).toBe(true);
    });
  });

  describe('logout', () => {
    it('should destroy session and return success', async () => {
      mockRequest.session.destroy = jest.fn((callback) => callback());

      await AuthController.logout(mockRequest, mockResponse, mockNext);

      expect(mockRequest.session.destroy).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('generateOtp', () => {
    it('should return 400 if email is missing', async () => {
      mockRequest.body = {};

      await AuthController.generateOtp(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return success when OTP is generated', async () => {
      mockRequest.body = { email: 'test@example.com' };
      mockAuthService.generateOtp.mockResolvedValue(true);

      await AuthController.generateOtp(mockRequest, mockResponse, mockNext);

      expect(mockResponse.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'OTP is send to registered email'
      });
    });
  });

  describe('changePassword', () => {
    it('should return 400 if any field is missing', async () => {
      mockRequest.body = { newPassword: 'newPass123', otp: '123456' };

      await AuthController.changePassword(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 200 on successful password change', async () => {
      mockRequest.body = {
        newPassword: 'newPass123',
        otp: '123456',
        email: 'test@example.com'
      };
      mockAuthService.changePassword.mockResolvedValue(true);

      await AuthController.changePassword(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith({
        status: 'success',
        message: 'password changed successfully'
      });
    });
  });
});
