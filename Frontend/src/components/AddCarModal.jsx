import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import { InlineIcon } from '@iconify/react';
import { useAuth0 } from "@auth0/auth0-react";
export function AddCarModal({ onSubmit }) {
  const [openModal, setOpenModal] = useState(false);
  const [company, setCompany] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('');
  const [purchaseYear, setPurchaseYear] = useState('');
  const [capacity, setCapacity] = useState('');
  const date = new Date().getFullYear();
  const { user } = useAuth0();
  //   console.log(date)

  function onCloseModal() {
    setOpenModal(false);
    setCompany('');
    setModel('');
    setType('');
    setPurchaseYear('');
    setCapacity('');
  }

  function submitHandler() {
    // setOpenModal(false);
    onSubmit(user, { company, model, type, purchaseYear, capacity });
    onCloseModal();
    return;
  }
  return (
    <>
      <Button onClick={() => setOpenModal(true)} className="text-black"><InlineIcon icon="fluent:add-16-regular">{' '}</InlineIcon></Button>
      <Modal dismissible show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add a new Car</h3>
            {/* <div className="flex gap-4"> */}
            <form onSubmit={submitHandler}>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="company" value="Company" />
                </div>
                <TextInput
                  id="company"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="model" value="Model" />
                </div>
                <TextInput id="model" value={model} onChange={(event) => setModel(event.target.value)} required />
              </div>
              {/* </div> */}

              <div className="flex gap-4">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="purchaseYear" value="Year of purchase" />
                  </div>
                  <TextInput type="number" min={date - 15} max={date} id="purchaseYear" value={purchaseYear} onChange={(event) => setPurchaseYear(event.target.value)} />
                </div>
                <div className="grow">
                  <div className="mb-2 block">
                    <Label htmlFor="type" value="Vechicle Type" />
                  </div>
                  <TextInput id="type" value={type} onChange={(event) => setType(event.target.value)} required />
                </div>
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="capacity" value="Capacity" />
                </div>
                <TextInput type="number" min="1" max="6" id="capacity" value={capacity} onChange={(event) => setCapacity(event.target.value)} required />
              </div>

              <div className="w-full mt-4">
                <Button type="submit">Add car</Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
