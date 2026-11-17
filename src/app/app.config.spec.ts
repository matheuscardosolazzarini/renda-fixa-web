import { formatNumber } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { appConfig } from './app.config';
import { exampleAsset, successEnvelope } from './core/http/testing/envelopes';

describe('appConfig', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...appConfig.providers, provideHttpClientTesting()] });
  });

  it('fornece o LOCALE_ID pt-BR', () => {
    // Arrange / Act
    const locale = TestBed.inject(LOCALE_ID);

    // Assert
    expect(locale).toBe('pt-BR');
  });

  it('registra o interceptor do envelope: uma requisição a /api/ chega desembrulhada', async () => {
    // Arrange
    const http = TestBed.inject(HttpClient);
    const httpMock = TestBed.inject(HttpTestingController);
    const asset = exampleAsset();

    // Act
    const result = firstValueFrom(http.get<unknown>('/api/Assets'));
    httpMock.expectOne('/api/Assets').flush(successEnvelope([asset]));

    // Assert
    expect(await result).toEqual([asset]);
    httpMock.verify();
  });

  it('registra os dados de locale pt-BR: formatNumber usa ponto no milhar e vírgula nos decimais', () => {
    // Arrange
    const value = 1003.15;

    // Act
    const formatted = formatNumber(value, 'pt-BR', '1.2-2');

    // Assert
    expect(formatted).toBe('1.003,15');
  });
});
