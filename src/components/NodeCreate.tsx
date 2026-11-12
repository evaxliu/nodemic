import { Dispatch, SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CompartmentNode } from './CustomNode';

type NodeCreateProps = { setNodes: Dispatch<SetStateAction<CompartmentNode[]>>, showModal: boolean }

export default function NodeCreate({ setNodes, showModal } : NodeCreateProps) {


  function createNewNode(e: React.FormEvent<HTMLFormElement>) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("Label")?.toString() ?? "";
    const symbol = formData.get("Symbol")?.toString() ?? "";
    const value = Number(formData.get("Value"));
    const infectious = formData.get("Infectious") === "True";
    // Add node to state
    setNodes((nodes) => [...nodes, { id: uuidv4(), position: { x: 50, y: 50 }, data: { name: name, symbol: symbol, value: value, infectious: infectious }, type: "custom-node" }]);
    // Reset form
    e.currentTarget.reset();
  }

  return (
    <div className={showModal ? '' : 'hidden'}>
      <form onSubmit={createNewNode} className='m-5 flex flex-wrap items-center gap-2'>
        <div className='flex gap-2'>
          <input name="Label" className='h-10 w-36 rounded-md border border-gray-300 px-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-500' required placeholder='Name' />
          <select name="Symbol" className='h-10 rounded-md border border-gray-300 px-3 text-gray-900 outline-none focus:border-gray-500' required>
            <option value="S">S</option>
            <option value="I">I</option>
            <option value="R">R</option>
          </select>
          <select name="Infectious" className='h-10 rounded-md border border-gray-300 px-3 text-gray-900 outline-none focus:border-gray-500' required>
            <option value="True">Infectious</option>
            <option value="False">Non-Infectious</option>
          </select>
          <input 
            name="Value"
            className='h-10 w-24 rounded-md border border-gray-300 px-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-500'
            type="number"
            min="0"
            step="any"
            required
            placeholder='Value'
          />
        </div>
        <button type="submit" className='h-10 cursor-pointer select-none rounded-md bg-gray-900 px-4 text-white hover:bg-gray-700'>Add</button>
      </form>
    </div>
  );
}