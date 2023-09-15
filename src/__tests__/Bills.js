/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import {ROUTES, ROUTES_PATH} from "../constants/routes.js";
import mockStore from "../__mocks__/store.js";
import userEvent from '@testing-library/user-event'
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";

const onNavigate = (pathname) => {
	document.body.innerHTML = ROUTES({ pathname })
}

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon).toBeTruthy(); // ce matcher jest est utiliser pour verifier si un element est present sur le DOM.
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })



    test("Then bill icon for viewing the receipt must be visible", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
                 window.localStorage.setItem('user', JSON.stringify({
                 type: 'Employee'}))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      // await waitFor(() => screen.getByTestId('icon-eye'))
      const iconEye = screen.getAllByTestId('icon-eye')
      //to-do write expect expression
      expect(iconEye).toBeTruthy(); // ce matcher jest est utiliser pour verifier si un element est present sur le DOM.
    })

                test('Then click on new bill button should load NewBill page', () => {
			document.body.innerHTML = BillsUI({ data: bills })
			const billContainer = new Bills({ document, onNavigate, store: mockStore, localStorage: localStorageMock })
			const handleClickNewBill = jest.fn(billContainer.handleClickNewBill)
			const buttonNewBill = screen.getByTestId('btn-new-bill')
			buttonNewBill.addEventListener('click', handleClickNewBill)
			userEvent.click(buttonNewBill)
			expect(handleClickNewBill).toHaveBeenCalled()
			expect(screen.getByTestId('form-new-bill')).toBeTruthy()
		})

		test('Then modal should display on eye click', () => {
			document.body.innerHTML = BillsUI({ data: bills })
			const billContainer = new Bills({ document, onNavigate, store: mockStore, localStorage: localStorageMock })
			const iconEye = screen.getAllByTestId('icon-eye')[0]
			const handleClickIconEye = jest.fn(billContainer.handleClickIconEye)
			iconEye.addEventListener('click', () => handleClickIconEye(iconEye))
			userEvent.click(iconEye)
			expect(handleClickIconEye).toHaveBeenCalled()
			expect(screen.getByTestId('modaleFileEmployee')).toBeTruthy()
		})
  })
})

//test d'intégration GET
describe('Given I am a user connected as employee', () => {
	describe('When I am on Bills page', () => {


		// test("fetches bills from mock API GET", async () => {
		// 	localStorage.setItem("user", JSON.stringify({ type: "Admin", email: "a@a" }));
		// 	const root = document.createElement("div")
		// 	root.setAttribute("id", "root")
		// 	document.body.append(root)
		// 	router()
		// 	window.onNavigate(ROUTES_PATH.Dashboard)
		// 	await waitFor(() => screen.getByText("Validations"))
		// 	const contentPending  = await screen.getByText("En attente (1)")
		// 	expect(contentPending).toBeTruthy()
		// 	const contentRefused  = await screen.getByText("Refusé (2)")
		// 	expect(contentRefused).toBeTruthy()
		// 	expect(screen.getByTestId("title")).toBeTruthy()
		//       })


		test('fetches bills from mock API GET', async () => {

                         //Je charge le dom avec les factures
			document.body.innerHTML = BillsUI({ data: bills })
                        //Je charge l'utilisateur dans le localStorage
			localStorage.setItem('user', JSON.stringify({ type: 'Employee', email: 'a@a' }))
			const root = document.createElement('div')
			root.setAttribute('id', 'root')
			document.body.append(root)
			router()
			window.onNavigate(ROUTES_PATH.Bills)
			await waitFor(() => screen.getByTestId('tbody'))
			expect(screen.getByTestId('tbody').innerHTML).toBeTruthy()
			const title = screen.getByTestId("title");
			expect(title).toBeTruthy()
		})

		describe('When an error occurs on API', () => {
			beforeEach(() => {
				jest.spyOn(mockStore, 'bills')
				Object.defineProperty(window, 'localStorage', { value: localStorageMock })
				window.localStorage.setItem(
					'user',
					JSON.stringify({
						type: 'Employee',
						email: 'employe@employe.tdl',
					})
				)
				const root = document.createElement('div')
				root.setAttribute('id', 'root')
				document.body.appendChild(root)
				router()
			})

			test('fetches bills from an API and fails with 404 message error', async () => {
				mockStore.bills.mockImplementationOnce(() => {
					return {
						list: () => {
							return Promise.reject(new Error('Erreur 404'))
						},
					}
				})
				window.onNavigate(ROUTES_PATH.Bills)
				await new Promise(process.nextTick)
				document.body.innerHTML = BillsUI({ error: 'Erreur 404' })
				const message = await screen.getByText(/Erreur 404/)
				expect(message).toBeTruthy()
			})

			test('fetches bills from an API and fails with 500 message error', async () => {
				mockStore.bills.mockImplementationOnce(() => {
					return {
						list: () => {
							return Promise.reject(new Error('Erreur 500'))
						},
					}
				})
				window.onNavigate(ROUTES_PATH.Bills)
				await new Promise(process.nextTick)
				document.body.innerHTML = BillsUI({ error: 'Erreur 500' })
				const message = await screen.getByText(/Erreur 500/)
				expect(message).toBeTruthy()
			})
		})
	})
})






