import React from 'react';

import SndrewEditor from '../typings/globals';

export interface IEditContainerState {
    controlled?: boolean;
    onChangePosition?: (nextPosition: SndrewEditor.IPoint) => void;

    currentPosition: {
        x: number;
        y: number;
    };

    lastDragPosition:
        | {
              x: number;
              y: number;
          }
        | undefined;
}

export default function withDrag(WrappedComponent: any) {
    return class WithDragComponent extends React.Component<any, IEditContainerState> {
        state: IEditContainerState = {
            currentPosition: this.props.currentPosition || { x: 0, y: 0 },
            lastDragPosition: undefined,
        };

        getPosition = () => {
            const { currentPosition: currentPositionState } = this.state;
            const { currentPosition: currentPositionProp, controlled } = this.props;
            return (controlled && currentPositionProp) || currentPositionState;
        };

        setPosition = (nextPosition: SndrewEditor.IPoint) => {
            const { onChangePosition, controlled } = this.props;
            if (controlled && onChangePosition) {
                onChangePosition(nextPosition);
            } else {
                this.setState({
                    currentPosition: nextPosition,
                });
            }
        };

        onTranslate = (xValue: number, yValue: number) => {
            const currentPosition = this.getPosition();
            this.setPosition({
                x: currentPosition.x + xValue,
                y: currentPosition.y + yValue,
            });
        };

        onMouseDown = (e: any) => {
            if (e.nativeEvent.which === 1) {
                const { screenX, screenY } = e;
                this.setState({
                    lastDragPosition: {
                        x: screenX,
                        y: screenY,
                    },
                });
            }
        };

        onMouseMove = (e: MouseEvent | any) => {
            const currentPosition = this.getPosition();
            const { lastDragPosition } = this.state;
            const { screenX, screenY } = e;
            if (lastDragPosition) {
                const deltaX = screenX - lastDragPosition.x;
                const deltaY = screenY - lastDragPosition.y;
                this.setPosition({
                    x: currentPosition.x + deltaX,
                    y: currentPosition.y + deltaY,
                });
                this.setState({
                    lastDragPosition: { x: screenX, y: screenY },
                });
            }
        };

        onMouseUp = () => {
            this.setState({
                lastDragPosition: undefined,
            });
        };

        componentDidUpdate(_prevProps: any, prevState: IEditContainerState) {
            if (this.state.lastDragPosition && !prevState.lastDragPosition) {
                //mouse
                document.addEventListener('mousemove', this.onMouseMove);
                document.addEventListener('mouseup', this.onMouseUp);
                //touch
                document.addEventListener('touchmove', this.onMouseMove);
                document.addEventListener('touchend', this.onMouseUp);
                document.addEventListener('touchcancel', this.onMouseUp);
            } else if (!this.state.lastDragPosition && prevState.lastDragPosition) {
                //mouse
                document.removeEventListener('mousemove', this.onMouseMove);
                document.removeEventListener('mouseup', this.onMouseUp);
                //touch
                document.removeEventListener('touchmove', this.onMouseMove);
                document.removeEventListener('touchend', this.onMouseUp);
                document.removeEventListener('touchcancel', this.onMouseUp);
            }
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    currentPosition={this.getPosition()}
                    onDragContainerMouseDown={this.onMouseDown}
                />
            );
        }
    };
}
