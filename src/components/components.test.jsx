import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'
import { Card } from './Card'
import { Callout } from './Callout'
import { Badge } from './Badge'
import { ProgressBar } from './ProgressBar'
import { Modal } from './Modal'
import { Toast } from './Toast'
import { Tooltip } from './Tooltip'
import { ScreenSizeGuard } from './ScreenSizeGuard'
import { th } from '../i18n/th'

describe('Design System Components', () => {
  describe('Button', () => {
    it('renders text and responds to click events', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>คลิกที่นี่</Button>)
      const button = screen.getByRole('button', { name: 'คลิกที่นี่' })
      expect(button).toBeInTheDocument()

      fireEvent.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not trigger onClick when disabled', () => {
      const handleClick = vi.fn()
      render(
        <Button disabled onClick={handleClick}>
          ปิดใช้งาน
        </Button>
      )
      const button = screen.getByRole('button', { name: 'ปิดใช้งาน' })
      expect(button).toBeDisabled()

      fireEvent.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('supports ariaLabel for icon-only buttons', () => {
      render(<Button ariaLabel="ค้นหา">🔍</Button>)
      expect(screen.getByRole('button', { name: 'ค้นหา' })).toBeInTheDocument()
    })
  })

  describe('Card', () => {
    it('renders title and children content', () => {
      render(<Card title="หัวข้อการ์ด">เนื้อหาภายในการ์ด</Card>)
      expect(screen.getByText('หัวข้อการ์ด')).toBeInTheDocument()
      expect(screen.getByText('เนื้อหาภายในการ์ด')).toBeInTheDocument()
    })
  })

  describe('Callout', () => {
    it('renders with default titles based on variant', () => {
      render(
        <>
          <Callout variant="tip">ข้อความแนะนำ</Callout>
          <Callout variant="warning">ข้อความเตือน</Callout>
          <Callout variant="note">ข้อความโน้ต</Callout>
          <Callout variant="mac">ข้อความแมค</Callout>
          <Callout variant="excel">ข้อความเอ็กเซล</Callout>
        </>
      )
      expect(screen.getByText(th.callout.tip)).toBeInTheDocument()
      expect(screen.getByText(th.callout.warning)).toBeInTheDocument()
      expect(screen.getByText(th.callout.note)).toBeInTheDocument()
      expect(screen.getByText(th.callout.mac)).toBeInTheDocument()
      expect(screen.getByText(th.callout.excel)).toBeInTheDocument()
    })

    it('allows custom titles', () => {
      render(
        <Callout variant="tip" title="คำแนะนำพิเศษ">
          ข้อความ
        </Callout>
      )
      expect(screen.getByText('คำแนะนำพิเศษ')).toBeInTheDocument()
    })
  })

  describe('Badge', () => {
    it('renders label correctly', () => {
      render(<Badge variant="success">สำเร็จ</Badge>)
      expect(screen.getByText('สำเร็จ')).toBeInTheDocument()
    })
  })

  describe('ProgressBar', () => {
    it('renders accessible progressbar with clamped value', () => {
      render(<ProgressBar value={40} max={100} label="ความคืบหน้า" showValue />)
      const bar = screen.getByRole('progressbar', { name: 'ความคืบหน้า' })
      expect(bar).toHaveAttribute('aria-valuenow', '40')
      expect(bar).toHaveAttribute('aria-valuemin', '0')
      expect(bar).toHaveAttribute('aria-valuemax', '100')
      expect(screen.getByText('40%')).toBeInTheDocument()
    })
  })

  describe('Modal', () => {
    it('renders title and triggers onClose when close button clicked', () => {
      const handleClose = vi.fn()
      render(
        <Modal isOpen={true} onClose={handleClose} title="หน้าต่างยืนยัน">
          ต้องการทำต่อหรือไม่
        </Modal>
      )
      expect(screen.getByText('หน้าต่างยืนยัน')).toBeInTheDocument()
      expect(screen.getByText('ต้องการทำต่อหรือไม่')).toBeInTheDocument()

      const closeButton = screen.getByRole('button', { name: th.common.close })
      fireEvent.click(closeButton)
      expect(handleClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Toast', () => {
    it('renders when isOpen is true and dismisses on close button click', () => {
      const handleClose = vi.fn()
      render(
        <Toast
          isOpen={true}
          message="บันทึกข้อมูลเรียบร้อย"
          type="success"
          onClose={handleClose}
        />
      )
      expect(screen.getByText('บันทึกข้อมูลเรียบร้อย')).toBeInTheDocument()
      const closeButton = screen.getByRole('button', { name: th.common.close })
      fireEvent.click(closeButton)
      expect(handleClose).toHaveBeenCalledTimes(1)
    })

    it('does not render when isOpen is false', () => {
      render(
        <Toast
          isOpen={false}
          message="ข้อความ"
          onClose={() => {}}
        />
      )
      expect(screen.queryByText('ข้อความ')).not.toBeInTheDocument()
    })
  })

  describe('Tooltip', () => {
    it('shows tooltip content on focus/hover and hides on blur', () => {
      render(
        <Tooltip text="ข้อความช่วยเหลือ">
          <button type="button">ปุ่มทดสอบ</button>
        </Tooltip>
      )
      const trigger = screen.getByRole('button', { name: 'ปุ่มทดสอบ' })
      const tooltip = screen.getByRole('tooltip')

      expect(tooltip).toBeInTheDocument()

      // Mouse enter triggers tooltip visibility
      fireEvent.mouseEnter(trigger.parentElement)
      expect(tooltip).toHaveClass(/visible/)

      // Mouse leave hides tooltip
      fireEvent.mouseLeave(trigger.parentElement)
      expect(tooltip).not.toHaveClass(/visible/)
    })
  })

  describe('ScreenSizeGuard', () => {
    it('renders banner notice and children', () => {
      render(
        <ScreenSizeGuard>
          <div>เนื้อหาหน้าจอหลัก</div>
        </ScreenSizeGuard>
      )
      expect(screen.getByText(th.screenSizeGuard.title)).toBeInTheDocument()
      expect(screen.getByText(th.screenSizeGuard.message)).toBeInTheDocument()
      expect(screen.getByText('เนื้อหาหน้าจอหลัก')).toBeInTheDocument()
    })
  })
})

