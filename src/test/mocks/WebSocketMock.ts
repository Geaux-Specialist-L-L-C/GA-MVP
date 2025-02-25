// File: /src/test/mocks/WebSocketMock.ts
// Description: Mock WebSocket implementation for testing
// Author: GitHub Copilot
// Created: 2024

export class WebSocketMock implements Partial<WebSocket> {
  // WebSocket states
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  // Required WebSocket properties
  public url: string;
  public binaryType: BinaryType = 'blob';
  private _readyState: number = WebSocketMock.CONNECTING;

  // Event handlers
  public onopen: ((event: Event) => void) | null = null;
  public onclose: ((event: CloseEvent) => void) | null = null;
  public onmessage: ((event: MessageEvent) => void) | null = null;
  public onerror: ((event: Event) => void) | null = null;

  constructor(url: string) {
    this.url = url;
  }

  // Mock methods
  public close(code?: number, reason?: string): void {
    this._readyState = WebSocketMock.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code, reason }));
    }
  }

  public send(data: string): void {
    // Mock implementation
  }

  // Getter for readyState to make it appear read-only
  get readyState(): number {
    return this._readyState;
  }

  // Test helper methods
  public mockOpen(): void {
    this._readyState = WebSocketMock.OPEN;
    if (this.onopen) {
      this.onopen(new Event('open'));
    }
  }

  public mockClose(code: number = 1000, reason: string = ''): void {
    this._readyState = WebSocketMock.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code, reason }));
    }
  }

  public mockError(): void {
    if (this.onerror) {
      this.onerror(new Event('error'));
    }
  }

  public mockMessage(data: any): void {
    if (this.onmessage) {
      this.onmessage(new MessageEvent('message', { data: JSON.stringify(data) }));
    }
  }

  public mockSetReadyState(state: number): void {
    this._readyState = state;
  }
}