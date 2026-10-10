import { Node, } from '@xyflow/react';
import { Dispatch, SetStateAction } from 'react';

type NodeCreateProps = { setNodes : Dispatch<SetStateAction<Node[]>>, showModal : boolean }

export default function NodeCreate({ setNodes, showModal } : NodeCreateProps) {

  function createNewNode(e: React.FormEvent<HTMLFormElement>) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.currentTarget;
    const formData = new FormData(form);
    const id = String(formData.get("Id") ?? "");
    const label = formData.get("Label");
    const value = formData.get("Value");
    const infectious = formData.get("Infectious");
    setNodes((nodes) => [...nodes, { id: id, position: { x: 50, y: 50 }, data: { label: id+"_"+label, value: value, infectious: infectious} }]);
    e.currentTarget.reset();
  }

  return (
    <div className={showModal ? '' : 'hidden'}>
      <form onSubmit={createNewNode} className='flex flex-col items-start gap-2 m-5'>
        <div className='flex gap-3'>
          <input name="Id" className='border p-2 rounded-2xl' required placeholder='Id' />
          <select name="Label" className='border p-3 rounded-2xl' required>
            <option value="S">S</option>
            <option value="I">I</option>
            <option value="R">R</option>
          </select>
          <select name="Infectious" className='border p-3 rounded-2xl' required>
            <option value="True">Infectious</option>
            <option value="False">Non-Infectious</option>
          </select>
          <input name="Value" className='border p-2 rounded-2xl' required placeholder='Value' />
        </div>
        <button type="submit" className='select-none cursor-pointer border p-2 rounded-2xl'>Add Compartment</button>
      </form>
    </div>
  );
}