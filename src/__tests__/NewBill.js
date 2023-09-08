/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom/extend-expect'
import { fireEvent, screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import mockStore from '../__mocks__/store.js'
import { localStorageMock } from '../__mocks__/localStorage.js'
import { Store } from '../__mocks__/store2.js'
import Router from '../app/Router.js'
import { ROUTES, ROUTES_PATH } from '../constants/routes'
import NewBill from '../containers/NewBill.js'
import BillsUI from '../views/BillsUI.js'

import router from '../app/Router.js'

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      // je m'assure que le bouton envoye est present sur le dom
      expect(document.querySelector('#btn-send-bill')).toBeTruthy();
      expect(document.querySelector('input[type="file"]')).toBeTruthy();
      expect(document.querySelector('input[data-testid="vat"]')).toBeTruthy();
      expect(document.querySelector('input[data-testid="pct"]')).toBeTruthy();
      expect(document.querySelector('select[data-testid="expense-type"]')).toBeTruthy();
      //to-do write assertion
    })

    describe('When I am on NewBill Page', () => {
      beforeEach(() => {
        const user = JSON.stringify({
          type: 'Employee',
          email: 'employee@test.tdl',
        })
        window.localStorage.setItem('user', user)
  
        const pathname = ROUTES_PATH['NewBill']
        Object.defineProperty(window, 'location', {
          value: {
            hash: pathname,
          },
        })
  
        document.body.innerHTML = `<div id="root"></div>`
        Router()
      })
  
      test('should require the input type', () => {
        const inputType = screen.getByTestId('expense-type')
        expect(inputType).toBeRequired()
      })
      test('should require the input type date', () => {
        const inputDate = screen.getByTestId('datepicker')
        expect(inputDate).toBeRequired()
      })
      test('should require the input type number amount', () => {
        const inputAmount = screen.getByTestId('amount')
        expect(inputAmount).toBeRequired()
      })
      it('should require the input type number pct', () => {
        const inputPct = screen.getByTestId('pct')
        expect(inputPct).toBeRequired()
      })
      test('should require the inupt number vat', () => {
        const inputVat = screen.getByTestId('vat')
        expect(inputVat).toBeRequired()
      })
      test('should require the input type file', () => {
        const inputfile = screen.getByTestId('file')
        expect(inputfile).toBeRequired()
      })
  
      test('should accept the input type file with format .jpg, .jpeg, .png', () => {
        const inputfile = screen.getByTestId('file')
        expect(inputfile).toHaveAttribute('accept', '.jpg, .jpeg, .png')
      })
    })
})

  // test d'intégration POST
  // describe('Given I am connected as an employee', () => {
  //   describe('When I complete the requested fields and I submit', () => {
  //     // to avoid bomb for those who maintains the code
  //     afterEach(jest.clearAllMocks)
  //     beforeEach(() => {
  //       jest.spyOn(mockStore, 'bills')
  //       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  //       window.localStorage.setItem(
  //         'user',
  //         JSON.stringify({
  //           type: 'Employee',
  //           email: 'a@a',
  //         })
  //       )
  //       const root = document.createElement('div')
  //       root.setAttribute('id', 'root')
  //       document.body.appendChild(root)
  //       router()
  //     })
  //     it('should add a new bill to mock API POST', async () => {
  //       const billsData = [...(await mockStore.bills().list())]
  //       const bill = {
  //         id: 'azerty3000',
  //         status: 'pending',
  //         pct: 20,
  //         amount: 1500,
  //         email: 'dev@openclassrooms.com',
  //         name: 'Le Bistroquet',
  //         vat: '10',
  //         fileName: 'preview-facture-free-201801-pdf-1.jpg',
  //         date: '2022-04-14',
  //         commentAdmin: 'no comment',
  //         commentary: 'postMockNewBill',
  //         type: 'Restaurants et bars',
  //         fileUrl: 'https://test-storage-billable.jpg',
  //       }
  
  //       const allBills = billsData.push(await mockStore.bills().create(bill))
  
  //       expect(allBills).toBe(5)
  //     })
  
  //     it('should add a bill to API and fails with 404 message error', async () => {
  //       mockStore.bills.mockImplementationOnce(() => {
  //         return {
  //           list: () => {
  //             return Promise.reject(new Error('Erreur 404'))
  //           },
  //         }
  //       })
  
  //       const html = BillsUI({ error: 'Erreur 404' })
  //       document.body.innerHTML = html
  //       const message = screen.getByText('/Erreur 404/')
  //       expect(message).toBeTruthy()
  //     })
  
  //     it('should add a bill to API and fails with 500 message error', async () => {
  //       mockStore.bills.mockImplementationOnce(() => {
  //         return {
  //           list: () => {
  //             return Promise.reject(new Error('Erreur 500'))
  //           },
  //         }
  //       })
  //       // initialise le body
  //       const html = BillsUI({ error: 'Erreur 500' })
  //       document.body.innerHTML = html
  //       const message = screen.getByText('/Erreur 500/')
  //       expect(message).toBeTruthy()
  //     })
  //   })
  //   })
  
})