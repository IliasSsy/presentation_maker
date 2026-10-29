import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSelection } from '../src/components/workspace/hooks/useSelection'

describe('useSelection', () => {
    it('selects a single object without shift key', () => {
        const { result } = renderHook(() => useSelection());
        const event = { preventDefault: () => {}, shiftKey: false } as unknown as React.MouseEvent;
        act(() => result.current.handleObjectClick(event, 'obj1'));
        act(() => result.current.handleObjectClick(event, 'obj2'));
        expect(result.current.activeObjectIds).toEqual(['obj2']);
    });
    it('adds to selection with shift key', () => {
        const { result } = renderHook(() => useSelection());
        const event = { preventDefault: () => {}, shiftKey: true } as unknown as React.MouseEvent; 
        act(() => result.current.handleObjectClick(event, 'obj1'));
        act(() => result.current.handleObjectClick(event, 'obj2'));
        expect(result.current.activeObjectIds).toEqual(['obj1', 'obj2']);
    });
    it('removes from selection when clicking already selected object with shift key', () => {
        const { result } = renderHook(() => useSelection());
        const event = { preventDefault: () => {}, shiftKey: true } as unknown as React.MouseEvent; 
        act(() => result.current.handleObjectClick(event, 'obj1'));
        act(() => result.current.handleObjectClick(event, 'obj2'));
        act(() => result.current.handleObjectClick(event, 'obj1'));
        expect(result.current.activeObjectIds).toEqual(['obj2']);
    });
    it('clears selection on background click', () => {
        const { result } = renderHook(() => useSelection());
        const clickEvent = { preventDefault: () => {}, shiftKey: false } as unknown as React.MouseEvent;
        const backgroundEvent = { target: 'background', currentTarget: 'background' } as unknown as React.MouseEvent; 
        act(() => result.current.handleObjectClick(clickEvent, 'obj1'));
        act(() => result.current.handleBackgroundClick(backgroundEvent));
        expect(result.current.activeObjectIds).toEqual([]);
    });
});