/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom/extend-expect'
import { fireEvent, screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import mockStore from '../__mocks__/store.js'
import { localStorageMock } from '../__mocks__/localStorage.js'
import Router from '../app/Router.js'
import { ROUTES, ROUTES_PATH } from '../constants/routes'
import NewBillUI from '../views/NewBillUI.js'
import NewBill from '../containers/NewBill.js'
import BillsUI from '../views/BillsUI.js'
import { Store } from '../__mocks__/store2.js'
import router from '../app/Router.js'

describe("Given I am connected as an employee", () => {


  beforeEach(() => {
    const user = JSON.stringify({
      type: 'Employee',
      email: 'a@a',
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
      // beforeEach(() => {
      //   const user = JSON.stringify({
      //     type: 'Employee',
      //     email:'employee@test.tdl',
      //   })
      //   window.localStorage.setItem('user', user)
  
      //   const pathname = ROUTES_PATH['NewBill']
      //   Object.defineProperty(window, 'location', {
      //     value: {
      //       hash: pathname,
      //     },
      //   })
  
      //   document.body.innerHTML = `<div id="root"></div>`
      //   Router()
      // })
  
      test('should require the input type', () => {
        const inputType = screen.getByTestId('expense-type')
        expect(inputType).toBeInTheDocument();
      })
      test('should require the input type date', () => {
        const inputDate = screen.getByTestId('datepicker')
        expect(inputDate).toBeInTheDocument();
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
        expect(inputVat).not.toBeRequired()
      })
      test('should require the input type file', () => {
        const inputfile = screen.getByTestId('file')
        expect(inputfile).toBeRequired;
      })
    })

    describe('When I do not fill fields && I click on submit button', () => {
      it('should renders NewBill original page', () => {
        const inputName = screen.getByTestId('expense-name')
        expect(inputName.getAttribute('placeholder')).toBe('Vol Paris Londres')
        expect(inputName.value).toBe('')
  
        const inputDate = screen.getByTestId('datepicker')
        expect(inputDate.value).toBe('')
  
        const inputAmount = screen.getByTestId('amount')
        expect(inputAmount.getAttribute('placeholder')).toBe('348')
        expect(inputAmount.value).toBe('')
  
        const inputVat = screen.getByTestId('vat')
        expect(inputVat.getAttribute('placeholder')).toBe('70')
        expect(inputVat.value).toBe('')
  
        const inputPct = screen.getByTestId('pct')
        expect(inputPct.getAttribute('placeholder')).toBe('20')
        expect(inputPct.value).toBe('')
  
        const inputComment = screen.getByTestId('commentary')
        expect(inputComment.value).toBe('')
  
        const inputFile = screen.getByTestId('file')
        expect(inputFile.value).toBe('')
  
        const form = screen.getByTestId('form-new-bill')
        userEvent.click(form)
        expect(screen.getByTestId('form-new-bill')).toBeTruthy()
      })
    }) 
  })




	describe('When I select the file', () => {
		it('should not upload the file when the file is wrong && handleChangeFile function is called', async () => {
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname })
			}
			let store = new Store()

			const myNewBill = new NewBill({
				document,
				onNavigate,
				store,
				localStorage: window.localStorage,
			})
      
			const blob = new Blob(['text'], { type: 'text/plain' })
			// const blob = new Blob(['text'], { type: 'image/txt' })

			const file = new File([blob], 'file.txt', { type: 'text/plain' })
			// const file = new File([blob], 'file.txt', { type: 'image/txt' })

			const inputFile = screen.getByTestId('file')

			const handleChangeFile = jest.fn((e) => myNewBill.handleChangeFile(e))
			inputFile.addEventListener('change', handleChangeFile)
			fireEvent.change(inputFile, {
				target: {
					files: [file],
				},
			})

			const aSecond = (second) => new Promise((resolve) => setTimeout(resolve, second))
			await aSecond(1000)

			expect(handleChangeFile).toHaveBeenCalledTimes(1)
			// expect(myNewBill.type).toBe('unknown')
			expect(myNewBill.fileName).toBe(null)
		})


    // test('should use the accepted png files formats', async () => {
		// 	// const onNavigate = (pathname) => {
		// 	// 	document.body.innerHTML = ROUTES({ pathname })
		// 	// }

    //   // const html = NewBillUI()
    //   // document.body.innerHTML = html

		// 	let store = new Store()
		// 	const myNewBill = new NewBill({
		// 		document,
		// 		onNavigate,
		// 		store,
		// 		localStorage: window.localStorage,
		// 	})
		// 	// byte for PNG (89 50 4E 47) in decimal number system
		// 	let obj = new Uint8Array([137, 80, 78, 71])
		// 	//blobs (Binary Large Objects)
		// 	const blob = new Blob([obj], { type: 'image/png' })
		// 	const file = new File([blob], 'file.png', { type: 'image/png' })
		// 	const inputFile = screen.getByTestId('file')
		// 	const handleChangeFile = jest.fn((e) => myNewBill.handleChangeFile(e))
		// 	inputFile.addEventListener('change', handleChangeFile)
		// 	fireEvent.change(inputFile, {
		// 		target: {
		// 			files: [file],
		// 		},
		// 	})
		// 	const aSecond = (second) => new Promise((resolve) => setTimeout(resolve, second))
		// 	await aSecond(1000)
    //   const val = myNewBill.fileName;
		// 	expect(myNewBill.fileUrl).not.toBe(null);
		// })



    // test('should use the accepted jpeg files formats', async () => {
    //   // const onNavigate = (pathname) => {
    //   //   document.body.innerHTML = ROUTES({ pathname })
    //   // }

    //   // const html = NewBillUI()
    //   // document.body.innerHTML = html

    //   let store = new Store()
    //   const myNewBill = new NewBill({
    //     document,
    //     onNavigate,
    //     store,
    //     localStorage: window.localStorage,
    //   })
    //   // byte for JPG (FF D8 FF E0) in decimal number system
    //   let obj = new Uint8Array([255, 216, 255, 224])
    //   //blobs (Binary Large Objects)
    //   const blob = new Blob([obj], { type: 'image/jpeg' })
    //   const file = new File([blob], 'file.jpeg', { type: 'image/jpeg' })
    //   const inputFile = screen.getByTestId('file')
    //   const handleChangeFile = jest.fn((e) => myNewBill.handleChangeFile(e))
    //   inputFile.addEventListener('change', handleChangeFile)
    //   fireEvent.change(inputFile, {
    //     target: {
    //       files: [file],
    //     },
    //   })
    //   const aSecond = (second) => new Promise((resolve) => setTimeout(resolve, second))
    //   await aSecond(1000)
    //   expect(myNewBill.type).toBe('image/jpeg')
    // })

  })

  describe('checkFileExtension', () => {
    test('should return true for allowed extensions', () => {

      let store = new Store()
			const myNewBill = new NewBill({
				document,
				onNavigate,
				store,
				localStorage: window.localStorage,
			})


      const filename1 = 'example.jpeg';
      const filename2 = 'example.jpg';
      const filename3 = 'example.png';
      const checkFileExtension = jest.fn((e) => myNewBill.checkFileExtension(e))
      expect(checkFileExtension(filename1)).toBe(true);
      expect(checkFileExtension(filename2)).toBe(true);
      expect(checkFileExtension(filename3)).toBe(true);
    });
  
    test('should return false for disallowed extensions', () => {
      let store = new Store()
			const myNewBill = new NewBill({
				document,
				onNavigate,
				store,
				localStorage: window.localStorage,
			})
      const checkFileExtension = jest.fn((e) => myNewBill.checkFileExtension(e))
      const filename1 = 'example.pdf';
      const filename2 = 'example.docx';
      const filename3 = 'example.gif';
  
      expect(checkFileExtension(filename1)).toBe(false);
      expect(checkFileExtension(filename2)).toBe(false);
      expect(checkFileExtension(filename3)).toBe(false);
    });
  
    test('should be case-insensitive', () => {
      let store = new Store()
			const myNewBill = new NewBill({
				document,
				onNavigate,
				store,
				localStorage: window.localStorage,
			})
      const checkFileExtension = jest.fn((e) => myNewBill.checkFileExtension(e))
      const filename1 = 'example.JPEG';
      const filename2 = 'example.jPg';
      const filename3 = 'example.PnG';
  
      expect(checkFileExtension(filename1)).toBe(true);
      expect(checkFileExtension(filename2)).toBe(true);
      expect(checkFileExtension(filename3)).toBe(true);
    });
  });

  })  

  //test d'intégration POST
  describe('Given I am connected as an employee', () => {
    describe('When I complete the requested fields and I submit', () => {
      // to avoid bomb for those who maintains the code
      afterEach(jest.clearAllMocks)
      beforeEach(() => {
        jest.spyOn(mockStore, 'bills')
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem(
          'user',
          JSON.stringify({
            type: 'Employee',
            email: 'a@a',
          })
        )
        const root = document.createElement('div')
        root.setAttribute('id', 'root')
        document.body.appendChild(root)
        router()
      })
      it('should add a new bill to mock API POST', async () => {
        const billsData = [...(await mockStore.bills().list())]
        const bill = {
          id: 'azerty3000',
          status: 'pending',
          pct: 20,
          amount: 1500,
          email: 'dev@openclassrooms.com',
          name: 'Le Bistroquet',
          vat: '10',
          fileName: 'preview-facture-free-201801-pdf-1.jpg',
          date: '2022-04-14',
          commentAdmin: 'no comment',
          commentary: 'postMockNewBill',
          type: 'Restaurants et bars',
          fileUrl: 'https://test-storage-billable.jpg',
        }
        const allBills = billsData.push(await mockStore.bills().create(bill))
        expect(allBills).toBe(5)
      })
  
      test('When I add a new invoice, I\'m redirected to the page listing the invoices.', async () => {
        const billsData = [...(await mockStore.bills().list())]
        const bill = {
          id: 'azerty3000',
          status: 'pending',
          pct: 20,
          amount: 1500,
          email: 'dev@openclassrooms.com',
          name: 'Le Bistroquet',
          vat: '10',
          fileName: 'preview-facture-free-201801-pdf-1.jpg',
          date: '2022-04-14',
          commentAdmin: 'no comment',
          commentary: 'postMockNewBill',
          type: 'Restaurants et bars',
          fileUrl: 'https://test-storage-billable.jpg',
        }
        const allBills = billsData.push(await mockStore.bills().create(bill))  
        expect(allBills).toBe(5)  
        
        document.body.innerHTML = BillsUI({ data: billsData })
        const message = screen.getByTestId('title');
        expect(message).toBeTruthy();
      })

      test('should add a bill to API and fails with 404 message error', async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error('Erreur 404'))
            },
          }
        })
        
        const html = BillsUI({ error: 'Erreur 404' })
        document.body.innerHTML = html
        const message = screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })
  
      test('should add a bill to API and fails with 500 message error', async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error('Erreur 500'))
            },
          }
        })
        // initialise le body
        const html = BillsUI({ error: 'Erreur 500' })
        document.body.innerHTML = html
        const message = screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })
    })
  
