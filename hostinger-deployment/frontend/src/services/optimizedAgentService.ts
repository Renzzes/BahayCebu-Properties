/**
 * Optimized Agent Service for Production Performance
 * Handles agent operations with better error handling and performance
 */

import { getApiBaseUrl } from '@/config/api';
import type { Agent, ApiAgent } from '@/data/agents';

export interface AgentUpdateOptions {
  skipImageOptimization?: boolean;
  timeout?: number;
  retries?: number;
}

export interface AgentOperationResult {
  success: boolean;
  data?: Agent;
  error?: string;
  performance?: {
    duration: number;
    imageSize?: number;
    networkTime?: number;
  };
}

const DEFAULT_OPTIONS: AgentUpdateOptions = {
  skipImageOptimization: false,
  timeout: 30000, // 30 seconds
  retries: 2
};

/**
 * Optimized Agent Service Class
 */
export class OptimizedAgentService {
  private apiBaseUrl: string;
  private requestCache: Map<string, Promise<any>> = new Map();

  constructor() {
    this.apiBaseUrl = getApiBaseUrl();
  }

  /**
   * Creates a timeout promise for request timeout handling
   */
  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeout);
    });
  }

  /**
   * Optimizes image data before sending
   */
  private optimizeImageData(imageUrl: string): string {
    if (!imageUrl || !imageUrl.startsWith('data:')) {
      return imageUrl;
    }

    // Check if image is too large
    const sizeInBytes = Math.round((imageUrl.length * 3) / 4);
    const maxSize = 500 * 1024; // 500KB

    if (sizeInBytes > maxSize) {
      console.warn(`Image size (${this.formatFileSize(sizeInBytes)}) exceeds recommended size. Consider using cloud storage.`);
    }

    return imageUrl;
  }

  /**
   * Validates agent data before sending
   */
  private validateAgentData(agentData: Partial<Agent>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!agentData.name?.trim()) errors.push('Name is required');
    if (!agentData.email?.trim()) errors.push('Email is required');
    if (!agentData.phone?.trim()) errors.push('Phone is required');
    if (!agentData.title?.trim()) errors.push('Title is required');
    if (!agentData.location?.trim()) errors.push('Location is required');
    if (!agentData.description?.trim()) errors.push('Description is required');

    // Email validation
    if (agentData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agentData.email)) {
      errors.push('Invalid email format');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Converts API agent to frontend agent format
   */
  private convertApiAgentToAgent(apiAgent: ApiAgent): Agent {
    return {
      id: apiAgent.id,
      name: apiAgent.name,
      title: apiAgent.title,
      email: apiAgent.email,
      phone: apiAgent.phone,
      location: apiAgent.location,
      description: apiAgent.description,
      image: apiAgent.image || '',
      specializations: Array.isArray(apiAgent.specializations) ? apiAgent.specializations : [],
      listings: Number(apiAgent.listings) || 0,
      deals: Number(apiAgent.deals) || 0,
      rating: Number(apiAgent.rating) || 0,
      socialMedia: {
        facebook: apiAgent.socialMedia?.facebook || '',
        instagram: apiAgent.socialMedia?.instagram || '',
        linkedin: apiAgent.socialMedia?.linkedin || ''
      }
    };
  }

  /**
   * Makes an optimized HTTP request with timeout and retry logic
   */
  private async makeRequest<T>(
    url: string,
    options: RequestInit,
    timeout: number = 30000,
    retries: number = 2
  ): Promise<T> {
    const requestKey = `${options.method || 'GET'}-${url}-${JSON.stringify(options.body || {})}`;
    
    // Check if the same request is already in progress
    if (this.requestCache.has(requestKey)) {
      return this.requestCache.get(requestKey);
    }

    const requestPromise = this.executeRequest<T>(url, options, timeout, retries);
    this.requestCache.set(requestKey, requestPromise);

    try {
      const result = await requestPromise;
      this.requestCache.delete(requestKey);
      return result;
    } catch (error) {
      this.requestCache.delete(requestKey);
      throw error;
    }
  }

  /**
   * Executes the actual HTTP request
   */
  private async executeRequest<T>(
    url: string,
    options: RequestInit,
    timeout: number,
    retries: number
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const networkStartTime = Date.now();
        
        const response = await Promise.race([
          fetch(url, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              ...options.headers
            }
          }),
          this.createTimeoutPromise(timeout)
        ]);

        const networkTime = Date.now() - networkStartTime;

        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage: string;
          
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.error || errorJson.message || `HTTP ${response.status}`;
          } catch {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
          
          throw new Error(errorMessage);
        }

        const data = await response.json();
        
        // Log performance metrics
        if (networkTime > 5000) {
          console.warn(`Slow network request: ${networkTime}ms for ${url}`);
        }

        return data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < retries) {
          console.warn(`Request attempt ${attempt + 1} failed, retrying...`, lastError.message);
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1))); // Exponential backoff
        }
      }
    }

    throw lastError!;
  }

  /**
   * Updates an agent with optimized performance
   */
  async updateAgent(
    agentId: string,
    agentData: Partial<Agent>,
    options: AgentUpdateOptions = {}
  ): Promise<AgentOperationResult> {
    const startTime = Date.now();
    const opts = { ...DEFAULT_OPTIONS, ...options };

    try {
      // Validate agent data
      const validation = this.validateAgentData(agentData);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`
        };
      }

      // Optimize image data if present
      let optimizedData = { ...agentData };
      if (agentData.image && !opts.skipImageOptimization) {
        optimizedData.image = this.optimizeImageData(agentData.image);
      }

      // Prepare update payload
      const updatePayload = {
        name: optimizedData.name,
        title: optimizedData.title,
        email: optimizedData.email,
        phone: optimizedData.phone,
        location: optimizedData.location,
        description: optimizedData.description,
        image: optimizedData.image || null,
        specializations: optimizedData.specializations || [],
        listings: Number(optimizedData.listings) || 0,
        deals: Number(optimizedData.deals) || 0,
        rating: Number(optimizedData.rating) || 0,
        socialMedia: optimizedData.socialMedia || {
          facebook: '',
          instagram: '',
          linkedin: ''
        }
      };

      // Make the API request
      const apiAgent = await this.makeRequest<ApiAgent>(
        `${this.apiBaseUrl}/api/agents/${agentId}`,
        {
          method: 'PUT',
          body: JSON.stringify(updatePayload)
        },
        opts.timeout,
        opts.retries
      );

      const duration = Date.now() - startTime;
      const agent = this.convertApiAgentToAgent(apiAgent);

      return {
        success: true,
        data: agent,
        performance: {
          duration,
          imageSize: agentData.image ? Math.round((agentData.image.length * 3) / 4) : undefined
        }
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('Error updating agent:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update agent',
        performance: { duration }
      };
    }
  }

  /**
   * Creates a new agent with optimized performance
   */
  async createAgent(
    agentData: Omit<Agent, 'id'>,
    options: AgentUpdateOptions = {}
  ): Promise<AgentOperationResult> {
    const startTime = Date.now();
    const opts = { ...DEFAULT_OPTIONS, ...options };

    try {
      // Validate agent data
      const validation = this.validateAgentData(agentData);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`
        };
      }

      // Optimize image data if present
      let optimizedData = { ...agentData };
      if (agentData.image && !opts.skipImageOptimization) {
        optimizedData.image = this.optimizeImageData(agentData.image);
      }

      // Make the API request
      const apiAgent = await this.makeRequest<ApiAgent>(
        `${this.apiBaseUrl}/api/agents`,
        {
          method: 'POST',
          body: JSON.stringify(optimizedData)
        },
        opts.timeout,
        opts.retries
      );

      const duration = Date.now() - startTime;
      const agent = this.convertApiAgentToAgent(apiAgent);

      return {
        success: true,
        data: agent,
        performance: {
          duration,
          imageSize: agentData.image ? Math.round((agentData.image.length * 3) / 4) : undefined
        }
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('Error creating agent:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create agent',
        performance: { duration }
      };
    }
  }

  /**
   * Fetches all agents with caching
   */
  async getAllAgents(): Promise<Agent[]> {
    try {
      const apiAgents = await this.makeRequest<ApiAgent[]>(
        `${this.apiBaseUrl}/api/agents`,
        { method: 'GET' }
      );

      return apiAgents.map(apiAgent => this.convertApiAgentToAgent(apiAgent));
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  }

  /**
   * Formats file size for logging
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export a default instance
export const optimizedAgentService = new OptimizedAgentService();

// Export convenience functions
export const updateAgentOptimized = (agentId: string, agentData: Partial<Agent>, options?: AgentUpdateOptions) => 
  optimizedAgentService.updateAgent(agentId, agentData, options);

export const createAgentOptimized = (agentData: Omit<Agent, 'id'>, options?: AgentUpdateOptions) => 
  optimizedAgentService.createAgent(agentData, options);