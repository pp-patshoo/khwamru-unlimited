import { describe, it, expect } from 'vitest'
import {
  getDatasetFsPath,
  getDatasetUrl,
  isSafeDatasetName,
  PYODIDE_DATA_DIR,
} from './datasetFiles'

describe('isSafeDatasetName', () => {
  it('accepts plain CSV file names', () => {
    expect(isSafeDatasetName('_test.csv')).toBe(true)
    expect(isSafeDatasetName('sales_dirty.csv')).toBe(true)
  })

  it('rejects names that could leave the data folder', () => {
    expect(isSafeDatasetName('../secret.csv')).toBe(false)
    expect(isSafeDatasetName('folder/sales.csv')).toBe(false)
    expect(isSafeDatasetName('..\\sales.csv')).toBe(false)
  })

  it('rejects names with spaces or other file types', () => {
    expect(isSafeDatasetName('my sales.csv')).toBe(false)
    expect(isSafeDatasetName('sales.xlsx')).toBe(false)
    expect(isSafeDatasetName('')).toBe(false)
  })

  it('rejects values that are not strings', () => {
    expect(isSafeDatasetName(null)).toBe(false)
    expect(isSafeDatasetName(123)).toBe(false)
  })
})

describe('dataset paths', () => {
  it('points the URL at public/datasets/', () => {
    expect(getDatasetUrl('_test.csv')).toMatch(/datasets\/_test\.csv$/)
  })

  it('writes the file where pd.read_csv("data/...") can find it', () => {
    expect(getDatasetFsPath('_test.csv')).toBe(`${PYODIDE_DATA_DIR}/_test.csv`)
    expect(PYODIDE_DATA_DIR).toBe('/home/pyodide/data')
  })
})
