import { components } from '../../api/schema';
import { ApiError } from './api-error';
import { requireFields } from './require-fields';
import { exampleAsset } from './testing/envelopes';

type AssetResponse = components['schemas']['AssetResponse'];

describe('requireFields', () => {
  it('devolve o valor quando os campos existem', () => {
    // Arrange
    const asset = exampleAsset();

    // Act
    const result = requireFields<AssetResponse>(asset, ['id', 'name', 'maturityDate']);

    // Assert
    expect(result).toBe(asset);
  });

  it('lança ApiError genérico quando falta um campo', () => {
    // Arrange
    const withoutMaturity: Partial<AssetResponse> = { ...exampleAsset(), maturityDate: undefined };

    // Act
    const call = () => requireFields<AssetResponse>(withoutMaturity, ['id', 'name', 'maturityDate']);

    // Assert
    expect(call).toThrow(ApiError);
    expect(call).toThrow('Ocorreu um erro inesperado. Tente novamente mais tarde.');
  });

  it('lança ApiError genérico quando o valor não é um objeto', () => {
    // Arrange
    const value: unknown = null;

    // Act
    const call = () => requireFields<AssetResponse>(value, ['id']);

    // Assert
    expect(call).toThrow(ApiError);
  });
});
