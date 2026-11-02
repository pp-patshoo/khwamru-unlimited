import { describe, it, expect, vi, afterEach } from 'vitest'
import { prepareEnvironment, PrepareError } from './environment'
import { th } from '../i18n/th'

// Pyodide จำลองเฉพาะส่วนที่ environment.js เรียกใช้
function fakePyodide() {
  const files = {}
  return {
    files,
    loadPackagesFromImports: vi.fn(async () => {}),
    loadPackage: vi.fn(async () => {}),
    FS: {
      mkdirTree: vi.fn(),
      writeFile: vi.fn((path, data) => {
        files[path] = data
      }),
    },
    globals: {
      // matplotlib ไม่ได้ติดตั้ง จึงไม่ต้องตั้งค่ากราฟในการทดสอบนี้
      get: () => () => false,
    },
  }
}

describe('prepareEnvironment', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('writes the dataset text into the Pyodide data folder', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, text: async () => 'a,b\n1,2\n' })),
    )
    const py = fakePyodide()

    await prepareEnvironment(py, { code: 'print(1)', datasets: ['sample.csv'], onProgress: vi.fn() })

    expect(py.files['/home/pyodide/data/sample.csv']).toBe('a,b\n1,2\n')
  })

  it('rejects a dataset name that could leave the data folder', async () => {
    const py = fakePyodide()

    await expect(
      prepareEnvironment(py, { code: '', datasets: ['../secret.csv'], onProgress: vi.fn() }),
    ).rejects.toBeInstanceOf(PrepareError)
    expect(py.FS.writeFile).not.toHaveBeenCalled()
  })

  it('shows a Thai message that says what to do when a dataset file is missing', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 404 })))
    const py = fakePyodide()

    await expect(
      prepareEnvironment(py, { code: '', datasets: ['missing.csv'], onProgress: vi.fn() }),
    ).rejects.toThrow(th.runner.prepare.datasetMissing('missing.csv'))
  })

  it('reports package loading progress through onProgress', async () => {
    const py = fakePyodide()
    py.loadPackagesFromImports.mockImplementation(async (code, options) => {
      options.messageCallback('Loading numpy, pandas')
    })
    const onProgress = vi.fn()

    await prepareEnvironment(py, { code: 'import pandas', onProgress })

    expect(onProgress).toHaveBeenCalledWith(th.runner.prepare.packageLoading('numpy, pandas'))
  })

  it('turns a package failure into a PrepareError with the package detail', async () => {
    const py = fakePyodide()
    py.loadPackage.mockRejectedValue(new Error('No known package named foo'))

    await expect(
      prepareEnvironment(py, { code: '', packages: ['foo'], onProgress: vi.fn() }),
    ).rejects.toThrow(th.runner.prepare.packageFailed('No known package named foo'))
  })
})
