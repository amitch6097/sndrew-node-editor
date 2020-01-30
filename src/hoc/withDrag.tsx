import React from 'react';

export interface IEditContainerState {
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

        onTranslate = (xValue: number, yValue: number) => {
            const { currentPosition } = this.state;
            this.setState({
                currentPosition: {
                    x: currentPosition.x + xValue,
                    y: currentPosition.y + yValue,
                },
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
            const { lastDragPosition, currentPosition } = this.state;
            const { screenX, screenY } = e;
            if (lastDragPosition) {
                const deltaX = screenX - lastDragPosition.x;
                const deltaY = screenY - lastDragPosition.y;
                this.setState({
                    currentPosition: {
                        x: currentPosition.x + deltaX,
                        y: currentPosition.y + deltaY,
                    },
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
                    currentPosition={this.state.currentPosition}
                    {...this.props}
                    onTranslate={this.onTranslate}
                    onDragContainerMouseDown={this.onMouseDown}
                />
            );
        }
    };
}
